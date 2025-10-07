import { describe, test, expect } from 'vitest'
import { screen, render } from '@testing-library/react'

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
})
