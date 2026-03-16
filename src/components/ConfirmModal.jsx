import { IconWarning } from './Icons'

/**
 * ConfirmModal - Componente reutilizable para confirmaciones
 *
 * @param {boolean} isOpen - Control de visibilidad del modal
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón de confirmar (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {string} variant - Variante de color: "danger" (default), "warning", "success"
 * @param {function} onConfirm - Callback al confirmar
 * @param {function} onCancel - Callback al cancelar (opcional, si no se provee usa onClose)
 */
const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  // Colores según la variante
  const variantStyles = {
    danger: {
      bg: 'bg-danger-100',
      icon: 'text-danger-600',
      button: 'bg-danger-500 hover:bg-danger-600',
      iconBg: 'bg-danger-100'
    },
    warning: {
      bg: 'bg-warning-100',
      icon: 'text-warning-600',
      button: 'bg-warning-500 hover:bg-warning-600',
      iconBg: 'bg-warning-100'
    },
    success: {
      bg: 'bg-success-100',
      icon: 'text-success-600',
      button: 'bg-success-500 hover:bg-success-600',
      iconBg: 'bg-success-100'
    }
  }

  const styles = variantStyles[variant] || variantStyles.danger

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scaleIn'>
        <div className='text-center'>
          {/* Icono */}
          <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconWarning className={`w-8 h-8 ${styles.icon}`} />
          </div>

          {/* Título */}
          <h3 className='text-xl font-bold text-gray-800 mb-2'>
            {title}
          </h3>

          {/* Mensaje */}
          <p className='text-gray-500 mb-6'>
            {message}
          </p>

          {/* Botones */}
          <div className='flex gap-3'>
            <button
              onClick={handleCancel}
              className='flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors'
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 ${styles.button} text-white py-3 px-4 rounded-xl font-semibold transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
