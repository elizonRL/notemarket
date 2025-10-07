import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BudgetControl from './BudgetControl'

describe('BudgetControl', () => {
  test('renderiza el título y el botón inicial', () => {
    render(<BudgetControl totalSpent={200} />)
    expect(screen.getByText(/control de presupuesto/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /establecer/i })).toBeDefined()
  })
})
