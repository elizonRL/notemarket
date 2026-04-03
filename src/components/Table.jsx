import { useState, useMemo, useCallback } from 'react'
import { IconTrash } from './Icons'
import ConfirmModal from './ConfirmModal'
import { QuantityEditor } from './QuantityEditor'

/**
 * Table - Componente para mostrar lista de productos
 * Refactorizado: usa QuantityEditor para eliminar duplicación
 */
const Table = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const [editingIndex, setEditingIndex] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState(null)

  // Memoizar el cálculo del total para evitar recálculos innecesarios
  const total = useMemo(
    () => products.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [products]
  )

  const startEdit = useCallback((index) => {
    setEditingIndex(index)
  }, [])

  const saveEdit = useCallback((index, newQuantity) => {
    onUpdateProduct(index, { ...products[index], quantity: newQuantity })
    setEditingIndex(null)
  }, [products, onUpdateProduct])

  const handleDeleteClick = useCallback((index) => {
    // Abrir modal directamente sin animación
    setProductToDelete(index)
    setShowDeleteModal(true)
  }, [])

  const confirmDelete = useCallback(() => {
    // Animar primero, luego eliminar
    setDeletingIndex(productToDelete)
    setShowDeleteModal(false)
    
    setTimeout(() => {
      if (productToDelete !== null) {
        onDeleteProduct(productToDelete)
      }
      setProductToDelete(null)
      setDeletingIndex(null)
    }, 300)
  }, [productToDelete, onDeleteProduct])

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false)
    setProductToDelete(null)
  }, [])

  // Stagger delay calculation for row animation
  const getRowDelay = (index) => {
    return { animationDelay: `${index * 50}ms` }
  }

  // Skeleton rows for loading state
  const SkeletonRow = ({ index }) => (
    <div
      className='p-4 animate-slideInUp'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Desktop skeleton */}
      <div className='hidden md:grid md:grid-cols-6 items-center gap-4'>
        <div className='h-5 bg-gray-200 rounded animate-skeleton w-3/4' />
        <div className='flex justify-center'>
          <div className='h-6 w-20 bg-gray-200 rounded-full animate-skeleton' />
        </div>
        <div className='flex justify-center'>
          <div className='h-5 w-12 bg-gray-200 rounded animate-skeleton' />
        </div>
        <div className='flex justify-center'>
          <div className='h-5 w-16 bg-gray-200 rounded animate-skeleton' />
        </div>
        <div className='flex justify-center'>
          <div className='h-5 w-16 bg-gray-200 rounded animate-skeleton' />
        </div>
        <div className='flex justify-center'>
          <div className='h-8 w-8 bg-gray-200 rounded-lg animate-skeleton' />
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className='md:hidden space-y-3'>
        <div className='flex justify-between'>
          <div className='h-5 bg-gray-200 rounded animate-skeleton w-2/3' />
          <div className='h-8 w-8 bg-gray-200 rounded-lg animate-skeleton' />
        </div>
        <div className='flex justify-between'>
          <div className='h-6 w-20 bg-gray-200 rounded-full animate-skeleton' />
          <div className='h-5 w-16 bg-gray-200 rounded animate-skeleton' />
        </div>
        <div className='h-8 bg-gray-200 rounded animate-skeleton' />
      </div>
    </div>
  )

  // Empty state illustration
  const EmptyState = () => (
    <div className='py-12'>
      <div className='flex justify-center mb-6'>
        <div className='relative'>
          {/* Shopping cart illustration */}
          <svg className='w-24 h-24 text-jacarta-200' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' />
          </svg>
          {/* Decorative elements */}
          <div className='absolute -top-2 -right-2 w-6 h-6 bg-warm-200 rounded-full animate-pulse' />
          <div className='absolute -bottom-1 -left-1 w-4 h-4 bg-success-200 rounded-full animate-pulse' style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
      <h3 className='text-xl font-semibold text-gray-700 mb-2'>Tu lista está vacía</h3>
      <p className='text-gray-500 max-w-sm mx-auto'>
        Agrega productos a tu carrito de compras haciendo clic en el botón &quot;Agregar producto&quot;
      </p>
    </div>
  )

  return (
    <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
      {/* Header para desktop */}
      <div className='hidden md:grid md:grid-cols-6 bg-gradient-to-r from-jacarta-50 to-jacarta-100 p-4 font-semibold text-gray-700 border-b'>
        <div>Producto</div>
        <div className='text-center'>Categoria</div>
        <div className='text-center'>Cantidad</div>
        <div className='text-center'>Precio unitario</div>
        <div className='text-center'>Subtotal</div>
        <div className='text-center'>Acciones</div>
      </div>

      {/* Productos */}
      <div className='divide-y divide-gray-100'>
        {products.map((item, i) => (
          <div
            key={i}
            className={`p-4 transition-all duration-200 hover:bg-jacarta-50 hover:shadow-sm group ${
              deletingIndex === i ? 'animate-scaleOut' : 'animate-slideInUp'
            }`}
            style={getRowDelay(i)}
          >
            {/* Vista desktop */}
            <div className='hidden md:grid md:grid-cols-6 items-center gap-4'>
              <div className='font-medium text-gray-900 group-hover:text-jacarta-700 transition-colors'>{item.name}</div>
              <div className='text-center'>
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-jacarta-100 text-jacarta-700 group-hover:bg-jacarta-200 group-hover:text-jacarta-800 transition-colors'>
                  {item.category}
                </span>
              </div>
              <div className='text-center'>
                {editingIndex === i
                  ? (
                    <QuantityEditor
                      value={item.quantity}
                      onSave={(newQty) => saveEdit(i, newQty)}
                      size='md'
                    />
                  )
                  : (
                    <button
                      onClick={() => startEdit(i)}
                      className='text-jacarta-600 font-semibold hover:text-jacarta-800 cursor-pointer px-2 py-1 rounded hover:bg-jacarta-100 transition-all'
                      title='Click para editar'
                    >
                      {item.quantityDisplay || `${item.quantity} ud(s)`}
                    </button>
                  )}
              </div>
              <div className='text-center text-jacarta-600 font-semibold group-hover:text-jacarta-800 transition-colors'>${item.price.toFixed(2)}</div>
              <div className='text-center font-bold text-gray-900 group-hover:text-jacarta-700 transition-colors'>${(item.quantity * item.price).toFixed(2)}</div>
              <div className='text-center'>
                <button
                  onClick={() => handleDeleteClick(i)}
                  className={`text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 ${
                    deletingIndex === i ? 'animate-scaleOut' : ''
                  }`}
                  title='Eliminar producto'
                >
                  <IconTrash className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Vista movil */}
            <div className='md:hidden'>
              <div className='flex justify-between items-start gap-2 mb-3'>
                <h3 className='font-semibold text-gray-900 flex-1 pr-2 group-hover:text-jacarta-700 transition-colors'>{item.name}</h3>
                <button
                  onClick={() => handleDeleteClick(i)}
                  className={`text-red-500 hover:text-red-700 p-2 flex-shrink-0 hover:scale-110 transition-transform ${
                    deletingIndex === i ? 'animate-scaleOut' : ''
                  }`}
                  title='Eliminar'
                >
                  <IconTrash className='w-5 h-5' />
                </button>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-jacarta-100 text-jacarta-700 group-hover:bg-jacarta-200 transition-colors'>
                  {item.category}
                </span>
                <span className='font-bold text-gray-900 text-lg group-hover:text-jacarta-700 transition-colors'>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
              <div className='flex justify-between items-center text-sm text-gray-600 bg-gray-50 group-hover:bg-jacarta-50 p-2 rounded-lg transition-colors'>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Cant:</span>
                  {editingIndex === i
                    ? (
                      <QuantityEditor
                        value={item.quantity}
                        onSave={(newQty) => saveEdit(i, newQty)}
                        size='sm'
                      />
                    )
                    : (
                      <button
                        onClick={() => startEdit(i)}
                        className='font-semibold text-jacarta-700 hover:text-jacarta-900 cursor-pointer'
                        title='Click para editar'
                      >
                        {item.quantityDisplay || `${item.quantity} ud(s)`}
                      </button>
                    )}
                </div>
                <span className='text-gray-500'>${item.price.toFixed(2)} c/u</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      {products.length > 0 && (
        <div className='bg-gradient-to-r from-jacarta-50 to-jacarta-100 p-4 border-t-2 border-jacarta-200 animate-slideInUp' style={{ animationDelay: `${products.length * 50}ms` }}>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-semibold text-gray-700'>Total general:</span>
            <span className='text-2xl font-bold text-jacarta-600'>${total.toFixed(2)}</span>
          </div>
          <div className='text-sm text-gray-500 mt-1'>
            {products.length} producto{products.length !== 1 ? 's' : ''} en total
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title='¿Eliminar producto?'
        message={`¿Estás seguro de que quieres eliminar "${products[productToDelete]?.name}" de tu lista?`}
        confirmText='Eliminar'
        cancelText='Cancelar'
        variant='danger'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onClose={cancelDelete}
      />
    </div>
  )
}

export default Table