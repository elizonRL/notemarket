import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BudgetControl from './BudgetControl'

describe('BudgetControl', () => {
  it('renders budget control component', () => {
    render(<BudgetControl totalSpent={0} />)
    expect(screen.getByText('💰 Control de Presupuesto')).toBeInTheDocument()
    expect(screen.getByText('Establecer')).toBeInTheDocument()
  })

  it('shows form when establish button is clicked', () => {
    render(<BudgetControl totalSpent={0} />)
    fireEvent.click(screen.getByText('Establecer'))
    expect(screen.getByPlaceholderText('Ingresa tu presupuesto')).toBeInTheDocument()
  })

  it('sets budget and shows budget info', () => {
    render(<BudgetControl totalSpent={50} />)
    fireEvent.click(screen.getByText('Establecer'))

    const input = screen.getByPlaceholderText('Ingresa tu presupuesto')
    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(screen.getByText('✓ Establecer'))

    expect(screen.getByText('Presupuesto:')).toBeInTheDocument()
    expect(screen.getByText('Gastado:')).toBeInTheDocument()
    expect(screen.getByText('Restante:')).toBeInTheDocument()
  })

  it('can cancel form', () => {
    render(<BudgetControl totalSpent={0} />)
    fireEvent.click(screen.getByText('Establecer'))

    expect(screen.getByPlaceholderText('Ingresa tu presupuesto')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancelar'))

    expect(screen.queryByPlaceholderText('Ingresa tu presupuesto')).not.toBeInTheDocument()
  })
})
