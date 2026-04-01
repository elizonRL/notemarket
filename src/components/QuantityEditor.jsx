import { useState } from 'react'

/**
 * QuantityEditor - Componente reutilizable para editar cantidades inline
 * Elimina la duplicación entre desktop y mobile en Table
 */
export const QuantityEditor = ({
  value,
  onSave,
  size = 'md', // 'sm' for mobile, 'md' for desktop
  autoFocus = true
}) => {
  const [editValue, setEditValue] = useState(value?.toString() || '')

  const handleChange = (e) => {
    setEditValue(e.target.value)
  }

  const handleBlur = () => {
    saveValue()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveValue()
    }
  }

  const saveValue = () => {
    const newValue = parseFloat(editValue)
    if (!isNaN(newValue) && newValue > 0) {
      onSave(newValue)
    }
  }

  const sizeClasses = {
    sm: 'w-16 px-2 py-1 text-sm', // Mobile
    md: 'w-20 px-2 py-1 text-base' // Desktop
  }

  return (
    <input
      type='number'
      step='0.01'
      min='0.01'
      value={editValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`
        text-center border-2 border-jacarta-500 rounded-lg 
        text-jacarta-600 font-semibold
        focus:outline-none focus:ring-2 focus:ring-jacarta-300
        ${sizeClasses[size]}
      `}
      autoFocus={autoFocus}
    />
  )
}

/**
 * QuantityDisplay - Muestra la cantidad con opción de edición
 */
export const QuantityDisplay = ({
  quantity,
  quantityDisplay,
  onEdit,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'font-semibold text-jacarta-700 hover:text-jacarta-900 cursor-pointer',
    md: 'text-jacarta-600 font-semibold hover:text-jacarta-800 cursor-pointer px-2 py-1 rounded hover:bg-jacarta-50'
  }

  return (
    <button
      onClick={onEdit}
      className={sizeClasses[size]}
      title='Click para editar'
    >
      {quantityDisplay || `${quantity} ud(s)`}
    </button>
  )
}
