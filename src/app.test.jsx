import { describe, test, expect } from 'vitest'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('Test App component', () => {
  test('tes app', () => {
    render(<App />)

    const element = screen.getByText('🛍️ Mi Carrito de Compras')
    expect(element).toBeDefined()
  })
  test('test Lista de productos', () => {
    render(<App />)

    const element = screen.getByText('Lista de productos')
    expect(element).toBeDefined()
  })

  test('test Presupuesto inicial', async () => {
    render(<App />)
    const element = screen.getByRole('button', { name: /\+ Agregar producto/i })
    await userEvent.click(element)

    const element2 = screen.getByText('✕ Cerrar formulario')
    expect(element2).toBeDefined()
  })
})
