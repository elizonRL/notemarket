import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BudgetControl from './BudgetControl'

describe('BudgetControl', () => {
  test('renderiza el título y el botón inicial', () => {
    render(<BudgetControl totalSpent={0} />)
    
    // El componente ahora usa "Presupuesto" en vez de "control de presupuesto"
    expect(screen.getByText('Presupuesto')).toBeDefined()
    expect(screen.getByText('Establecer')).toBeDefined()
  })
})
