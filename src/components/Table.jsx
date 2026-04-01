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
    setProductToDelete(index)
    setShowDeleteModal(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (productToDelete !== null) {
      onDeleteProduct(productToDelete)
    }
    setShowDeleteModal(false)
    setProductToDelete(null)
  }, [productToDelete, onDeleteProduct])

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false)
    setProductToDelete(null)
  }, [])

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
          <div key={i} className='p-4 hover:bg-gray-50 transition-colors duration-200'>
            {/* Vista desktop */}
            <div className='hidden md:grid md:grid-cols-6 items-center gap-4'>
              <div className='font-medium text-gray-900'>{item.name}</div>
              <div className='text-center'>
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-jacarta-100 text-jacarta-700'>
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
                      className='text-jacarta-600 font-semibold hover:text-jacarta-800 cursor-pointer px-2 py-1 rounded hover:bg-jacarta-50'
                      title='Click para editar'
                    >
                      {item.quantityDisplay || `${item.quantity} ud(s)`}
                    </button>
                  )}
              </div>
              <div className='text-center text-jacarta-600 font-semibold'>${item.price.toFixed(2)}</div>
              <div className='text-center font-bold text-gray-900'>${(item.quantity * item.price).toFixed(2)}</div>
              <div className='text-center'>
                <button
                  onClick={() => handleDeleteClick(i)}
                  className='text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors'
                >
                  <IconTrash className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Vista movil */}
            <div className='md:hidden'>
              <div className='flex justify-between items-start gap-2 mb-3'>
                <h3 className='font-semibold text-gray-900 flex-1 pr-2'>{item.name}</h3>
                <button
                  onClick={() => handleDeleteClick(i)}
                  className='text-red-500 hover:text-red-700 p-2 flex-shrink-0'
                >
                  <IconTrash className='w-5 h-5' />
                </button>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-jacarta-100 text-jacarta-700'>
                  {item.category}
                </span>
                <span className='font-bold text-gray-900 text-lg'>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
              <div className='flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg'>
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
      <div className='bg-gradient-to-r from-jacarta-50 to-jacarta-100 p-4 border-t-2 border-jacarta-200'>
        <div className='flex justify-between items-center'>
          <span className='text-lg font-semibold text-gray-700'>Total general:</span>
          <span className='text-2xl font-bold text-jacarta-600'>${total.toFixed(2)}</span>
        </div>
        <div className='text-sm text-gray-500 mt-1'>
          {products.length} producto{products.length !== 1 ? 's' : ''} en total
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title='¿Eliminar producto?'
        message={`¿Estás seguro de que quieres eliminar "${products[productToDelete]?.name}" de tu lista?`}
        confirmText='Eliminar'
        cancelText='Cancelar'
        variant='danger'
        onConfirm={confirmDelete}
        onClose={cancelDelete}
      />
    </div>
  )
}

export default Table
