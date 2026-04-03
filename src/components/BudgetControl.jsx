import { useState, useMemo, useRef, useEffect } from 'react'
import { Input } from './Input'
import { IconMoney, IconAlert, IconWarning, IconCheck } from './Icons'

// ============================================
// CONSTANTES
// ============================================
const BUDGET_THRESHOLDS = {
  WARNING: 80,
  DANGER: 100
}

const BudgetControl = ({ totalSpent }) => {
  const [budget, setBudget] = useState(0)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const tooltipRef = useRef(null)

  // Memoizar cálculos derivados
  const percentage = useMemo(
    () => budget > 0 ? (totalSpent / budget) * 100 : 0,
    [budget, totalSpent]
  )

  const remaining = useMemo(
    () => budget - totalSpent,
    [budget, totalSpent]
  )

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(Math.min(percentage, 100))
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  // Memoizar el color del estado basado en el porcentaje
  const statusColor = useMemo(() => {
    if (percentage >= BUDGET_THRESHOLDS.DANGER) return 'text-danger-600'
    if (percentage >= BUDGET_THRESHOLDS.WARNING) return 'text-warning-600'
    return 'text-success-600'
  }, [percentage])

  // Memoizar el gradiente de la barra de progreso
  const progressGradient = useMemo(() => {
    if (percentage >= BUDGET_THRESHOLDS.DANGER) {
      return 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)'
    }
    if (percentage >= BUDGET_THRESHOLDS.WARNING) {
      return 'linear-gradient(90deg, #f97316 0%, #ea580c 50%, #dc2626 100%)'
    }
    return 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)'
  }, [percentage])

  // Memoizar el mensaje del tooltip
  const tooltipMessage = useMemo(() => {
    if (remaining >= 0) {
      return `Te faltan $${remaining.toFixed(2)} para alcanzar tu presupuesto`
    }
    return `Has excedido tu presupuesto en $${Math.abs(remaining).toFixed(2)}`
  }, [remaining])

  const handleSetBudget = () => {
    const value = parseFloat(budgetInput)
    if (!isNaN(value) && value > 0) {
      setBudget(value)
      setAnimatedProgress(0)
    }
    setShowBudgetForm(false)
    setBudgetInput('')
  }

  const handleCancelBudget = () => {
    setBudget(0)
    setAnimatedProgress(0)
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
    <article className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-hidden relative animate-slideUp'>
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
              <span className={`font-bold ${remaining >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
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

          {/* Progress bar con gradiente y tooltip */}
          <aside
            className='mt-4 relative'
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            ref={tooltipRef}
          >
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Progreso</span>
              <span className={statusColor}>{percentage.toFixed(1)}%</span>
            </div>

            {/* Custom progress bar con gradiente */}
            <div className='relative h-4 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out'
                style={{
                  width: `${animatedProgress}%`,
                  background: progressGradient,
                  boxShadow: percentage >= BUDGET_THRESHOLDS.DANGER
                    ? '0 0 10px rgba(239, 68, 68, 0.5)'
                    : percentage >= BUDGET_THRESHOLDS.WARNING
                    ? '0 0 10px rgba(249, 115, 22, 0.5)'
                    : '0 0 8px rgba(16, 185, 129, 0.3)'
                }}
              />
              {/* Efecto de brillo/shimmer */}
              {percentage < BUDGET_THRESHOLDS.DANGER && (
                <div
                  className='absolute top-0 left-0 h-full w-full animate-shimmer'
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                  }}
                />
              )}
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div
                className={`absolute z-10 px-3 py-2 rounded-lg text-sm text-white shadow-lg animate-tooltip ${
                  remaining >= 0 ? 'bg-jacarta-600' : 'bg-danger-600'
                }`}
                style={{
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px'
                }}
              >
                {tooltipMessage}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent ${
                    remaining >= 0 ? 'border-t-jacarta-600' : 'border-t-danger-600'
                  }`}
                />
              </div>
            )}
          </aside>

          {/* Alertas más visibles */}
          {percentage >= BUDGET_THRESHOLDS.DANGER && (
            <div className='mt-4 p-4 bg-gradient-to-r from-danger-500 to-danger-600 border-0 rounded-xl shadow-lg animate-pulse'>
              <p className='text-white font-semibold flex items-center gap-2'>
                <IconAlert className='w-5 h-5' />
                ¡Has excedido tu presupuesto!
              </p>
              <p className='text-danger-100 text-sm mt-1'>
                Te has pasado por $${Math.abs(remaining).toFixed(2)}
              </p>
            </div>
          )}
          {percentage >= BUDGET_THRESHOLDS.WARNING && percentage < BUDGET_THRESHOLDS.DANGER && (
            <div className='mt-4 p-4 bg-gradient-to-r from-warning-400 to-warning-500 border-0 rounded-xl shadow-lg'>
              <p className='text-white font-semibold flex items-center gap-2'>
                <IconWarning className='w-5 h-5' />
                ¡Cuidado! Te acercas al límite
              </p>
              <p className='text-warning-100 text-sm mt-1'>
                Te quedan $${remaining.toFixed(2)} disponibles
              </p>
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default BudgetControl