import { describe, test, expect, vi } from 'vitest'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mockear el hook de storage para evitar async loading
vi.mock('./hooks/useProductStorage', () => ({
  useProductStorage: () => ({
    products: [],
    isLoading: false,
    error: null,
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    clearAll: vi.fn(),
    storageMode: 'local'
  })
}))

import App from './App'

describe('Test App component', () => {
  test('renderiza el título principal', () => {
    render(<App />)
    
    const element = screen.getByText('Mi Carrito de Compras')
    expect(element).toBeDefined()
  })
  
  test('renderiza la sección de productos', () => {
    render(<App />)

    const element = screen.getByText('Lista de productos')
    expect(element).toBeDefined()
  })

  test('muestra mensaje cuando no hay productos', () => {
    render(<App />)

    const element = screen.getByText(/No hay productos agregados aún/)
    expect(element).toBeDefined()
  })

  test('abre el formulario al hacer click en agregar', async () => {
    render(<App />)
    
    const button = screen.getByRole('button', { name: /Agregar producto/i })
    await userEvent.click(button)

    // El formulario debería aparecer
    const formTitle = screen.getByText('Nuevo Producto')
    expect(formTitle).toBeDefined()
  })
})
