/**
 * Tests para el componente FormSection
 * Este archivo contiene pruebas unitarias para verificar el comportamiento
 * del formulario de agregar productos en la aplicación SmartCart.
 */

import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

import FormSection from './FormSection'
import userEvent from '@testing-library/user-event'

// Mocks para las funciones que recibe el componente como props
const createProduct = vi.fn() // Mock para simular la función de crear producto
const onClose = vi.fn() // Mock para simular la función de cerrar formulario

// Helper function para renderizar el componente con las props necesarias
const Component = () => render(<FormSection handleAddProduct={createProduct} onClose={onClose} />)

describe('test para probar el fromulario de agregar productos', async () => {
  /**
   * Test 1: Verificar renderizado inicial

   * Objetivo: Comprobar que el formulario se renderiza correctamente
   * con todos los elementos básicos visibles.
   */
  test('renderiza el título y el botón inicial', () => {
    // Paso 1: Renderizar el componente
    Component()

    // Paso 2: Verificar que el label del campo nombre esté presente
    expect(screen.getByText(/Nombre del producto/i)).toBeDefined()

    // Paso 3: Verificar que el botón de agregar producto esté presente
    expect(screen.getByRole('button', { name: /✓ Agregar producto/i })).toBeDefined()
  })

  /**
   * Test 2: Flujo completo de agregar producto
   * Objetivo: Simular la interacción completa del usuario llenando
   * el formulario y verificar que se llame correctamente la función
   * handleAddProduct con los datos correctos.
   * Pasos del test:
   * 1. Renderizar el componente
   * 2. Obtener referencias a todos los campos del formulario
   * 3. Llenar cada campo con datos de prueba
   * 4. Hacer clic en el botón de agregar
   * 5. Verificar que se llamó la función con los datos correctos
   */
  test('Se crea un producto con los datos ingresados', async () => {
    // Paso 1: Renderizar el componente FormSection
    Component()

    // Paso 2: Obtener referencias a los elementos del formulario
    const inputProductName = screen.getByPlaceholderText(/Ej: Manzanas rojas/i)
    const selectCategory = screen.getByRole('combobox')
    const inputQuantity = screen.getByPlaceholderText('1')
    const inputPrice = screen.getByPlaceholderText('0.00')

    // Paso 3: Configurar userEvent para simular interacciones del usuario
    const user = userEvent.setup()

    // Paso 4: Llenar el formulario con datos de prueba
    await user.type(inputProductName, 'Manzanas rojas') // Escribir nombre del producto
    await user.selectOptions(selectCategory, '🥬 Frutas y Verduras') // Seleccionar categoría
    await user.type(inputQuantity, '10') // Escribir cantidad
    await user.type(inputPrice, '2.50') // Escribir precio

    // Paso 5: Obtener referencia al botón de agregar y hacer clic
    const addButton = screen.getByRole('button', { name: /✓ Agregar producto/i })
    await user.click(addButton)

    // Paso 6: Verificaciones - Comprobar que la función mock fue llamada correctamente
    expect(createProduct).toHaveBeenCalledTimes(1) // Verificar que se llamó exactamente una vez
    expect(createProduct).toHaveBeenCalledWith({ // Verificar que se llamó con los datos correctos
      name: 'Manzanas rojas',
      category: '🥬 Frutas y Verduras',
      quantity: 10, // Nota: se convierte automáticamente a número
      price: 2.5 // Nota: se convierte automáticamente a número
    })
  })
})
