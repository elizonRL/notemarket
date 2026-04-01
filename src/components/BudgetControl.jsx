import { useState, useMemo } from 'react'
import { Input } from './Input'
import LinearProgress from '@mui/material/LinearProgress'
import { IconMoney, IconAlert, IconWarning } from './Icons'

// ============================================
// CONSTANTES
// ============================================
const BUDGET_THRESHOLDS = {
  WARNING: 80,  // Porcentaje para alerta de advertencia
  DANGER: 100   // Porcentaje para alerta de peligro
}

const BudgetControl = ({ totalSpent }) => {
  const [budget, setBudget] = useState(0)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  // Memoizar cálculos derivados
  const percentage = useMemo(
    () => budget > 0 ? (totalSpent / budget) * 100 : 0,
    [budget, totalSpent]
  )

  const remaining = useMemo(
    () => budget - totalSpent,
    [budget, totalSpent]
  )

  // Memoizar el color del estado basado en el porcentaje
  const statusColor = useMemo(() => {
    if (percentage >= BUDGET_THRESHOLDS.DANGER) return 'text-danger-600'
    if (percentage >= BUDGET_THRESHOLDS.WARNING) return 'text-warning-600'
    return 'text-success-600'
  }, [percentage])

  // Memoizar el color de la barra de progreso
  const progressBarColor = useMemo(() => {
    if (percentage >= BUDGET_THRESHOLDS.DANGER) return '#ef4444' // red
    if (percentage >= BUDGET_THRESHOLDS.WARNING) return '#f97316' // orange
    return '#10b981' // green
  }, [percentage])

  const handleSetBudget = () => {
    const value = parseFloat(budgetInput)
    if (!isNaN(value) && value > 0) {
      setBudget(value)
    }
    setShowBudgetForm(false)
    setBudgetInput('')
  }

  const handleCancelBudget = () => {
    setBudget(0)
    setShowBudgetForm(false)
    setBudgetInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSetBudget()
    }
  }

  const handleCloseForm = () => {
    setShowBudgetForm(false)
    setBudgetInput('')
  }

  return (
    <article className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-hidden relative'>
      <div className='absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-jacarta-500 to-jacarta-600' />
      <section className='flex justify-between items-center mb-4'>
        <h3 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
          <IconMoney className='w-5 h-5 text-jacarta-600' />
          Presupuesto
        </h3>
        <button
          onClick={() => setShowBudgetForm(!showBudgetForm)}
          className='text-jacarta-600 hover:text-jacarta-800 font-semibold text-sm px-3 py-1 rounded-full hover:bg-jacarta-50 transition-colors'
        >
          {budget > 0 ? 'Editar' : 'Establecer'}
        </button>
      </section>

      {showBudgetForm && (
        <section className='mb-4 p-4 bg-gray-50 rounded-lg animate-fadeIn'>
          <Input
            type='number'
            placeholder='Ingresa tu presupuesto'
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
            min='0'
            step='0.01'
          />
          <aside className='flex gap-2 mt-3'>
            <button
              onClick={handleSetBudget}
              className='flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors'
            >
              ✓ Establecer
            </button>
            <button
              onClick={handleCloseForm}
              className='px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors'
            >
              Cancelar
            </button>
          </aside>
        </section>
      )}

      {budget > 0 && (
        <>
          <section className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Presupuesto:</span>
              <span className='font-bold text-gray-900'>${budget.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Gastado:</span>
              <span className={`font-bold ${statusColor}`}>${totalSpent.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Restante:</span>
              <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={handleCancelBudget} 
              className='w-full text-sm text-blue-600 hover:text-blue-800 font-medium'
            >
              Cancelar presupuesto
            </button>
          </section>

          <aside className='mt-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Progreso</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <LinearProgress
              variant='determinate'
              value={Math.min(percentage, 100)}
              sx={{
                height: 13,
                borderRadius: 5,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: progressBarColor,
                  transition: 'background-color 0.3s ease'
                }
              }}
            />
          </aside>

          {percentage >= BUDGET_THRESHOLDS.DANGER && (
            <div className='mt-3 p-3 bg-red-100 border border-red-300 rounded-lg'>
              <p className='text-red-700 font-medium flex items-center gap-2'>
                <IconAlert className='w-4 h-4' />
                Has excedido tu presupuesto!
              </p>
            </div>
          )}
          {percentage >= BUDGET_THRESHOLDS.WARNING && percentage < BUDGET_THRESHOLDS.DANGER && (
            <div className='mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg'>
              <p className='text-yellow-700 font-medium flex items-center gap-2'>
                <IconWarning className='w-4 h-4' />
                Te acercas al limite de tu presupuesto
              </p>
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default BudgetControl
