import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOCR } from './useOCR'

// Mock de Tesseract.js
vi.mock('tesseract.js', () => ({
  default: {
    recognize: vi.fn()
  }
}))

import Tesseract from 'tesseract.js'

const mockRecognize = Tesseract.recognize

describe('useOCR Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('inicializa con estados por defecto', () => {
    const { result } = renderHook(() => useOCR())

    expect(result.current.isProcessing).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.error).toBe(null)
  })

  test('procesa imagen exitosamente', async () => {
    // Mock de respuesta exitosa de Tesseract
    mockRecognize.mockResolvedValue({
      data: {
        text: 'Manzana\n$5.99\nx3'
      }
    })

    const { result } = renderHook(() => useOCR())

    await act(async () => {
      await result.current.processImage('test-image.jpg')
    })

    expect(result.current.isProcessing).toBe(false)
  })

  test('maneja error en procesamiento', async () => {
    // Mock de error
    mockRecognize.mockRejectedValue(new Error('OCR failed'))

    const { result } = renderHook(() => useOCR())

    await act(async () => {
      const output = await result.current.processImage('test-image.jpg')
      expect(output.success).toBe(false)
      expect(output.error).toBe('OCR failed')
    })

    expect(result.current.isProcessing).toBe(false)
  })

  test('actualiza progreso durante procesamiento', async () => {
    let progressCallback

    mockRecognize.mockImplementation((image, lang, options) => {
      progressCallback = options.logger
      return Promise.resolve({ data: { text: 'Test' } })
    })

    const { result } = renderHook(() => useOCR())

    await act(async () => {
      await result.current.processImage('test-image.jpg')
    })

    // Simular progreso
    act(() => {
      progressCallback({ status: 'recognizing text', progress: 0.5 })
    })

    expect(result.current.progress).toBe(50)
  })
})

describe('parseProductText - Extracción de datos', () => {
  // Para testar la función de parsing sin el hook completo,
  // necesitamos exportar la función o recrear el escenario

  test('extrae precio con formato $XX.XX', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Leche Entera\n$3.50\nx1' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.price).toBe(3.50)
  })

  test('extrae precio con formato XX,XX€', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Pan Integral\n12,50€\nx2' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.price).toBe(12.50)
  })

  test('extrae cantidad con formato x5', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Huevos\nx12\n$4.00' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.quantity).toBe(12)
  })

  test('extrae cantidad con formato "X unidades"', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Yogurt\n5 unidades\n$2.00' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.quantity).toBe(5)
  })

  test('extrae nombre del producto correctamente', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Coca Cola 2L\n$5.99\nx1' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.name).toBeTruthy()
    expect(output.name).not.toBe('Producto detectado')
  })

  test('maneja PVP: en la etiqueta', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Detergente\nPVP: 8.99\nx1' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.price).toBe(8.99)
  })

  test('devuelve valores por defecto cuando no detecta datos', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: '' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.name).toBe('Producto detectado')
    expect(output.price).toBe(0)
    expect(output.quantity).toBe(1)
  })

  test('detecta producto con peso (ej: 500g)', async () => {
    mockRecognize.mockResolvedValue({
      data: { text: 'Arroz 500g\n$3.20\nx1' }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    expect(output.name).toContain('Arroz')
  })

  test('parsea etiqueta de supermercado típica colombiana', async () => {
    // Simula el texto OCR de una etiqueta real como las imágenes proporcionadas
    mockRecognize.mockResolvedValue({
      data: {
        text: `ESTUCHE FRESCOL LECHE ENTERA
PES Net 946 ml
PVP $19,90
X1`
      }
    })

    const { result } = renderHook(() => useOCR())

    let output
    await act(async () => {
      output = await result.current.processImage('test.jpg')
    })

    console.log('Output:', output)

    // Verificar que extrae correctamente
    expect(output.name).toBe('ESTUCHE FRESCOL LECHE ENTERA')
    expect(output.price).toBe(19.90)
    expect(output.quantity).toBe(1)
  })
})
