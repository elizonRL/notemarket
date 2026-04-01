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
    // El header renderiza correctamente - busca 'note' seguido de 'Market'
    const noteText = screen.getByText('note')
    expect(noteText).toBeDefined()
    const marketText = screen.getByText('Market')
    expect(marketText).toBeDefined()
  })

  test('Paraghaf on header', () => {
    render(<Header />)
    const element = screen.getByText('Tu asistente de compras inteligente')
    expect(element).toBeDefined()
  })
})
