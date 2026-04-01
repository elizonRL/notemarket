import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input Component', () => {
  test('renderiza input con type por defecto', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('renderiza con type especificado', () => {
    render(<Input type='number' />)
    const input = screen.getByRole('spinbutton')
    expect(input).toBeInTheDocument()
  })

  test('renderiza con type password', () => {
    render(<Input type='password' />)
    // Buscar el input por su tipo usando querySelector
    const passwordInput = document.querySelector('input[type="password"]')
    expect(passwordInput).toBeInTheDocument()
  })

  test('renderiza con placeholder', () => {
    render(<Input placeholder='Escribe aquí' />)
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument()
  })

  test('renderiza con valor inicial', () => {
    render(<Input value='Valor inicial' />)
    expect(screen.getByDisplayValue('Valor inicial')).toBeInTheDocument()
  })

  test('llama onChange cuando el valor cambia', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hola')

    expect(handleChange).toHaveBeenCalled()
  })

  test('renderiza con clases personalizadas', () => {
    render(<Input className='custom-class another-class' />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
    expect(input).toHaveClass('another-class')
  })

  test('soporta atributos adicionales via spread', () => {
    render(<Input data-testid='mi-input' aria-label='Mi input' />)
    expect(screen.getByLabelText('Mi input')).toBeInTheDocument()
  })

  test('renderiza con ref', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('funciona como input controlado', () => {
    const { rerender } = render(<Input value='Primero' />)
    expect(screen.getByDisplayValue('Primero')).toBeInTheDocument()

    rerender(<Input value='Segundo' />)
    expect(screen.getByDisplayValue('Segundo')).toBeInTheDocument()
  })

  test('funciona como input no controlado', async () => {
    const user = userEvent.setup()

    render(<Input defaultValue='Valor inicial' />)

    const input = screen.getByDisplayValue('Valor inicial')
    await user.type(input, ' extra')

    expect(screen.getByDisplayValue('Valor inicial extra')).toBeInTheDocument()
  })
})
