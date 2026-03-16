/**
 * Tests para el componente FormSection
 */

import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'

import FormSection from './FormSection'
import userEvent from '@testing-library/user-event'

// Mocks para las funciones que recibe el componente como props
const createProduct = vi.fn()
const onClose = vi.fn()

// Helper function para renderizar el componente con las props necesarias
const Component = () => render(<FormSection handleAddProduct={createProduct} onClose={onClose} />)

describe('test para probar el formulario de agregar productos', async () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Test 1: Verificar renderizado inicial
   */
  test('renderiza el título y el botón inicial', () => {
    Component()

    // Verificar que el label del campo nombre esté presente
    expect(screen.getByText(/Nombre del producto/i)).toBeDefined()

    // Verificar que el botón de agregar esté presente (ahora dice "Agregar")
    expect(screen.getByRole('button', { name: /Agregar/i })).toBeDefined()
  })

  /**
   * Test 2: Flujo completo de agregar producto
   */
  test('Se crea un producto con los datos ingresados', async () => {
    Component()

    // Obtener referencias a los elementos del formulario
    const inputProductName = screen.getByPlaceholderText(/Ej: Manzana roja orgánica/i)
    const selectCategory = screen.getByRole('combobox')
    const inputQuantity = screen.getByPlaceholderText('1')
    const inputPrice = screen.getByPlaceholderText('0.00')

    // Configurar userEvent para simular interacciones del usuario
    const user = userEvent.setup()

    // Llenar el formulario con datos de prueba
    await user.type(inputProductName, 'Manzanas rojas')
    await user.selectOptions(selectCategory, 'Frutas y Verduras')
    await user.type(inputQuantity, '10')
    await user.type(inputPrice, '2.50')

    // Obtener referencia al botón de agregar y hacer clic
    const addButton = screen.getByRole('button', { name: /Agregar/i })
    await user.click(addButton)

    // Verificar que la función mock fue llamada
    expect(createProduct).toHaveBeenCalledTimes(1)
    expect(createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Manzana',
        category: 'Frutas y Verduras',
        price: 2.5
      })
    )
  })

  /**
   * Test 3: Muestra errores si el formulario está incompleto
   */
  test('Muestra errores si el formulario está incompleto', async () => {
    Component()
    const user = userEvent.setup()

    const addButton = screen.getByRole('button', { name: /Agregar/i })
    await user.click(addButton)

    // Verificar que se muestra el mensaje de error para nombre
    expect(screen.getByText(/El nombre es requerido/i)).toBeDefined()
  })

  /**
   * Test 4: El formulario se cierra al hacer clic en el botón de cerrar
   */
  test('El formulario se cierra al hacer clic en el botón de cerrar', async () => {
    Component()
    const user = userEvent.setup()
    const closeButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
