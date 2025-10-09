import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import BudgetControl from './BudgetControl'
import userEvent from '@testing-library/user-event'

const Component = () => render(<BudgetControl totalSpent={200} />)

describe('BudgetControl', () => {
  test('renderiza el título y el botón inicial', () => {
    Component()
    expect(screen.getByText(/control de presupuesto/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /establecer/i })).toBeDefined()
  })
  test('muestra el formulario cuando se hace clic en "Establecer presupuesto"', async () => {
    Component()
    const establecerButton = screen.getByRole('button', { name: /establecer/i })
    await userEvent.click(establecerButton)

    expect(screen.getByRole('button', { name: /✓ Establecer/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDefined()
  })
})
