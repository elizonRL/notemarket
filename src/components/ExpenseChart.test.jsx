import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ExpenseChart from './ExpenseChart'

// Datos de prueba
const mockProducts = [
  { name: 'Manzana', category: 'Frutas y Verduras', quantity: 5, price: 1.50 },
  { name: 'Leche', category: 'Lácteos', quantity: 2, price: 3.20 },
  { name: 'Pan', category: 'Panadería', quantity: 1, price: 2.00 }
]

describe('ExpenseChart Component', () => {
  test('no renderiza cuando no hay productos', () => {
    const { container } = render(<ExpenseChart products={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test('no renderiza cuando products es undefined o null', () => {
    // Nota: Cuando products es undefined/null, productExpenses returns []
    // porque el useMemo verifica `if (!products || products.length === 0)`
    const { container } = render(<ExpenseChart products={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  test('renderiza el título del gráfico', () => {
    render(<ExpenseChart products={mockProducts} />)
    expect(screen.getByText('Resumen de Compras')).toBeInTheDocument()
  })

  test('muestra el total gastado correctamente', () => {
    render(<ExpenseChart products={mockProducts} />)
    // Total: (5*1.50) + (2*3.20) + (1*2.00) = 7.50 + 6.40 + 2.00 = 15.90
    expect(screen.getByText('$15.90')).toBeInTheDocument()
  })

  test('muestra el conteo de productos', () => {
    render(<ExpenseChart products={mockProducts} />)
    expect(screen.getByText('3 productos')).toBeInTheDocument()
  })

  test('muestra las categorías únicas', () => {
    render(<ExpenseChart products={mockProducts} />)
    // Usar getAllByText para múltiples elementos
    const categories = screen.getAllByText(/Frutas y Verduras|Lácteos|Panadería/)
    expect(categories.length).toBeGreaterThan(0)
  })

  test('muestra la categoría principal (la de mayor gasto)', () => {
    render(<ExpenseChart products={mockProducts} />)
    // Verificar que existe la categoría principal (la primera en la lista)
    const principalCategory = screen.getByText((content, element) => {
      return element.classList.contains('text-sm') && element.textContent === 'Frutas y Verduras'
    })
    expect(principalCategory).toBeInTheDocument()
  })

  test('muestra el detalle de productos', () => {
    render(<ExpenseChart products={mockProducts} />)
    expect(screen.getByText('Detalle de productos')).toBeInTheDocument()
  })

  test('calcula el promedio por producto correctamente', () => {
    render(<ExpenseChart products={mockProducts} />)
    // Promedio: 15.90 / 3 = 5.30
    expect(screen.getByText('$5.30')).toBeInTheDocument()
  })

  test('renderiza las barras de progreso por categoría', () => {
    render(<ExpenseChart products={mockProducts} />)
    // Verificar que hay elementos con role progressbar o similar
    const progressBars = document.querySelectorAll('.h-3')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  test('actualiza cuando cambian los productos', () => {
    const { rerender } = render(<ExpenseChart products={mockProducts} />)

    expect(screen.getByText('$15.90')).toBeInTheDocument()

    // Agregar otro producto
    const newProducts = [
      ...mockProducts,
      { name: 'Huevos', category: 'Lácteos', quantity: 1, price: 4.00 }
    ]

    rerender(<ExpenseChart products={newProducts} />)

    // Nuevo total: 15.90 + 4.00 = 19.90
    expect(screen.getByText('$19.90')).toBeInTheDocument()
    expect(screen.getByText('4 productos')).toBeInTheDocument()
  })

  test('maneja productos con precio 0', () => {
    const productsWithZero = [
      { name: 'Producto Gratis', category: 'Otros', quantity: 1, price: 0 }
    ]

    render(<ExpenseChart products={productsWithZero} />)
    // Usar getAllByText ya que hay múltiples elementos con $0.00
    const zeros = screen.getAllByText('$0.00')
    expect(zeros.length).toBeGreaterThan(0)
  })
})
