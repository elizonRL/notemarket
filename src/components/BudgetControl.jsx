import { useState, useRef } from 'react'
import { Input } from './Input'

const BudgetControl = ({ totalSpent }) => {
  const [budget, setBudget] = useState(0)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const inputRef = useRef(null)

  const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0
  const remaining = budget - totalSpent

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-red-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getBarColor = () => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const cancelPresupuesto = () => {
    setBudget(0)
    setShowBudgetForm(false)
  }

  return (
    <article className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
      <section className='flex justify-between items-center mb-4'>
        <h3 className='text-xl font-bold text-gray-800'>💰 Control de Presupuesto</h3>
        <button
          onClick={() => setShowBudgetForm(!showBudgetForm)}
          className='text-blue-600 hover:text-blue-800 font-medium'
        >
          {budget > 0 ? 'Cambiar' : 'Establecer'}
        </button>
      </section>

      {showBudgetForm && (
        <section className='mb-4 p-4 bg-gray-50 rounded-lg'>
          <Input
            ref={inputRef}
            type='number'
            placeholder='Ingresa tu presupuesto'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
            defaultValue={budget > 0 ? budget : ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setBudget(parseFloat(inputRef.current.value) || 0)
                setShowBudgetForm(false)
              }
            }}
          />
          <aside className='flex gap-2 mt-3'>
            <button
              onClick={() => {
                setBudget(parseFloat(inputRef.current.value) || 0)
                setShowBudgetForm(false)
              }}
              className='flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors'
            >
              ✓ Establecer
            </button>
            <button
              onClick={() => setShowBudgetForm(false)}
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
              <span className={`font-bold ${getStatusColor()}`}>${totalSpent.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Restante:</span>
              <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
            <button onClick={cancelPresupuesto} className='w-full text-sm text-blue-600 hover:text-blue-800 font-medium'>
              Cancelar presupuesto
            </button>
          </section>

          <aside className='mt-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Progreso</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-4'>
              <div
                className={`h-4 rounded-full transition-all duration-500 ${getBarColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </aside>

          {percentage >= 100 && (
            <div className='mt-3 p-3 bg-red-100 border border-red-300 rounded-lg'>
              <p className='text-red-700 font-medium'>🚨 ¡Has excedido tu presupuesto!</p>
            </div>
          )}
          {percentage >= 80 && percentage < 100 && (
            <div className='mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg'>
              <p className='text-yellow-700 font-medium'>⚠️ Te acercas al límite de tu presupuesto</p>
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default BudgetControl
