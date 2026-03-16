import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Table from './Table'

// Datos de prueba
const mockProducts = [
  { name: 'Manzana', category: 'Frutas y Verduras', quantity: 5, price: 1.50, quantityDisplay: '5 ud(s)' },
  { name: 'Leche', category: 'Lácteos', quantity: 2, price: 3.20, quantityDisplay: '2 ud(s)' },
  { name: 'Pan', category: 'Panadería', quantity: 1, price: 2.00, quantityDisplay: '1 ud(s)' }
]

const mockHandlers = {
  onUpdateProduct: vi.fn(),
  onDeleteProduct: vi.fn()
}

describe('Table Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renderiza la tabla con productos', () => {
    render(<Table products={mockProducts} {...mockHandlers} />)

    const products = screen.getAllByText('Manzana')
    expect(products.length).toBeGreaterThan(0)
  })

  test('renderiza las categorías', () => {
    render(<Table products={mockProducts} {...mockHandlers} />)

    const categories = screen.getAllByText('Frutas y Verduras')
    expect(categories.length).toBeGreaterThan(0)
  })

  test('calcula y muestra el total correctamente', () => {
    render(<Table products={mockProducts} {...mockHandlers} />)

    // Total esperado: (5*1.50) + (2*3.20) + (1*2.00) = 7.50 + 6.40 + 2.00 = 15.90
    expect(screen.getAllByText('$15.90').length).toBeGreaterThan(0)
  })

  test('muestra mensaje cuando no hay productos', () => {
    render(<Table products={[]} {...mockHandlers} />)

    expect(screen.getByText('Total general:')).toBeInTheDocument()
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0)
  })

  test('llama a onDeleteProduct cuando se presiona eliminar', async () => {
    const user = userEvent.setup()
    render(<Table products={mockProducts} {...mockHandlers} />)

    // Buscar botones de eliminar (icono de papelera)
    const deleteButtons = screen.getAllByRole('button')
    // El primer botón de eliminar debería estar en el primer producto
    await user.click(deleteButtons[1]) // Saltar el botón de cantidad

    // Ahora aparece el modal de confirmación - hacer clic en "Eliminar"
    const confirmButton = screen.getByRole('button', { name: /eliminar/i })
    await user.click(confirmButton)

    expect(mockHandlers.onDeleteProduct).toHaveBeenCalled()
  })

  test('renderiza el conteo de productos', () => {
    render(<Table products={mockProducts} {...mockHandlers} />)

    expect(screen.getByText('3 productos en total')).toBeInTheDocument()
  })

  test('renderiza correctamente las columnas', () => {
    render(<Table products={mockProducts} {...mockHandlers} />)

    // Verificar headers de columna
    expect(screen.getByText('Producto')).toBeInTheDocument()
    expect(screen.getByText('Categoria')).toBeInTheDocument()
    expect(screen.getByText('Cantidad')).toBeInTheDocument()
    expect(screen.getByText('Precio unitario')).toBeInTheDocument()
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
  })
})
