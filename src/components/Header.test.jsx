import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import Header from './HeaderSection'

describe('test Header component', () => {
  test('header h1', () => {
    render(<Header />)
    const element = screen.getByText('SmartCart')
    expect(element).toBeDefined()
  })
  test('div icon', () => {
    render(<Header />)
    const element = screen.getByText('💰')
    expect(element).toBeDefined()
  })
  test('Paraghaf on header', () => {
    render(<Header />)
    const element = screen.getByText('Control inteligente de gastos')
    expect(element).toBeDefined()
  })
})
