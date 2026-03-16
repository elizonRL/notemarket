import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './HeaderSection'

describe('test Header component', () => {
  test('header h1', () => {
    render(<Header />)
    const element = screen.getByText('note')
    expect(element).toBeDefined()
  })

  test('div icon', () => {
    render(<Header />)
    // El header renderiza correctamente
    expect(screen.getByText('noteMarket')).toBeDefined()
  })

  test('Paraghaf on header', () => {
    render(<Header />)
    const element = screen.getByText('Tu asistente de compras inteligente')
    expect(element).toBeDefined()
  })
})
