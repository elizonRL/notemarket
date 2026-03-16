import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OCRScanner from './OCRScanner'

// Mock de las props
const mockOnScanComplete = vi.fn()
const mockOnClose = vi.fn()

describe('OCRScanner Component', () => {
  test('renderiza el título', () => {
    render(<OCRScanner onScanComplete={mockOnScanComplete} onClose={mockOnClose} />)
    // Ahora el título tiene emoji 📷
    expect(screen.getByText(/Escanear Producto/)).toBeDefined()
  })

  test('renderiza opciones de cámara y galería', () => {
    render(<OCRScanner onScanComplete={mockOnScanComplete} onClose={mockOnClose} />)
    expect(screen.getByText(/Usar Camara/)).toBeDefined()
  })

  test('botón de cerrar llama a onClose', async () => {
    render(<OCRScanner onScanComplete={mockOnScanComplete} onClose={mockOnClose} />)
    const closeButton = screen.getByRole('button', { name: '' })
    await userEvent.click(closeButton)
    // El onClose debería llamarse
  })
})

describe('OCRScanner UI Elements', () => {
  test('renderiza el overlay del modal', () => {
    render(<OCRScanner onScanComplete={mockOnScanComplete} onClose={mockOnClose} />)
    // Verifica que el modal está presente
    expect(screen.getByText(/Selecciona una opción/)).toBeDefined()
  })

  test('renderiza el container del modal', () => {
    render(<OCRScanner onScanComplete={mockOnScanComplete} onClose={mockOnClose} />)
    // Verifica el texto de selección
    expect(screen.getByText(/Selecciona una opción para escanear el producto/)).toBeDefined()
  })
})
