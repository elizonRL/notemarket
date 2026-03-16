import { useState } from 'react'
import Table from '@components/Table'
import Header from '@components/HeaderSection'
import FormSection from '@components/FormSection'
import ExpenseChart from '@components/ExpenseChart'
import BudgetControl from '@components/BudgetControl'
import ConfirmModal from '@components/ConfirmModal'
import { useProductStorage } from '@hooks/useProductStorage'
import { generateInvoicePDF } from '@utils/pdfGenerator'
import { IconPlus, IconClose, IconCart, IconEmpty, IconMoney, IconDownload, IconClear } from '@components/Icons'

function App () {
  const [showForm, setShowForm] = useState(false)
  const [showClearAllModal, setShowClearAllModal] = useState(false)

  // Usar el hook de storage (ya maneja localStorage automáticamente)
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAll,
    isLoading,
    storageMode
  } = useProductStorage()

  const handleAddProduct = async (product) => {
    await addProduct(product)
  }

  const handleUpdateProduct = async (index, updatedProduct) => {
    await updateProduct(index, updatedProduct)
  }

  const handleDeleteProduct = async (index) => {
    await deleteProduct(index)
  }

  const handleClearAll = async () => {
    setShowClearAllModal(true)
  }

  const confirmClearAll = async () => {
    await clearAll()
    setShowClearAllModal(false)
  }

  const cancelClearAll = () => {
    setShowClearAllModal(false)
  }

  const handleGeneratePDF = () => {
    const totalSpent = products.reduce((sum, product) => sum + (product.quantity * product.price), 0)
    generateInvoicePDF(products, totalSpent)
  }

  const totalSpent = products.reduce((sum, product) => sum + (product.quantity * product.price), 0)

  if (isLoading) {
    return (
      <>
        <Header />
        <main className='flex items-center justify-center min-h-[50vh]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-jacarta-500 mx-auto mb-4' />
            <p className='text-gray-500'>Cargando productos...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        <section className='px-4 py-6'>
          <div className='max-w-4xl mx-auto space-y-6'>
            <BudgetControl totalSpent={totalSpent} />

            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2'>
                <IconCart className='w-6 h-6 text-jacarta-600' />
                Mi Carrito de Compras
              </h2>

              {/* Botones principales */}
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className='bg-gradient-to-r from-jacarta-500 to-jacarta-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-jacarta-600 hover:to-jacarta-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center gap-2'
                >
                  {showForm
                    ? <><IconClose className='w-5 h-5' /> Cerrar</>
                    : <><IconPlus className='w-5 h-5' /> Agregar producto</>
                  }
                </button>

                {products.length > 0 && (
                  <>
                    <div className='bg-jacarta-100 text-jacarta-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2'>
                      <IconMoney className='w-5 h-5' />
                      Total: ${totalSpent.toFixed(2)}
                    </div>

                    {/* Botones de acción */}
                    <button
                      onClick={handleGeneratePDF}
                      className='bg-gradient-to-r from-warm-500 to-warm-600 text-white px-4 py-3 rounded-xl shadow-md hover:from-warm-600 hover:to-warm-700 transition-all duration-300 font-medium flex items-center justify-center gap-2'
                      title='Generar factura PDF'
                    >
                      <IconDownload className='w-5 h-5' />
                      <span className='hidden sm:inline'>PDF</span>
                    </button>

                    <button
                      onClick={handleClearAll}
                      className='bg-danger-500 text-white px-4 py-3 rounded-xl shadow-md hover:bg-danger-600 transition-all duration-300 font-medium flex items-center justify-center gap-2'
                      title='Limpiar todo'
                    >
                      <IconClear className='w-5 h-5' />
                      <span className='hidden sm:inline'>Limpiar</span>
                    </button>
                  </>
                )}
              </div>

              {/* Indicador de modo de almacenamiento */}
              <p className='text-xs text-gray-400 mt-2'>
                Almacenamiento: {storageMode === 'api' ? '🔗 API' : '💾 Local'}
              </p>
            </div>

            {showForm && (
              <div className='animate-fadeIn'>
                <FormSection handleAddProduct={handleAddProduct} onClose={() => setShowForm(false)} />
              </div>
            )}
          </div>
        </section>
        <section className='px-4 py-6'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Lista de productos</h2>
            {products.length === 0
              ? (
                <div className='text-center py-12'>
                  <div className='flex justify-center mb-4'>
                    <IconEmpty className='w-16 h-16 text-gray-300' />
                  </div>
                  <p className='text-gray-500 text-xl'>No hay productos agregados aún</p>
                  <p className='text-gray-400 text-sm mt-2'>Haz clic en &quot;Agregar producto&quot; para comenzar</p>
                </div>
              )
              : (
                <>
                  <Table
                    products={products}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                  <div className='mt-8'>
                    <ExpenseChart products={products} />
                  </div>
                </>
              )}
          </div>
        </section>

        {/* Modal de confirmación para limpiar todo */}
        <ConfirmModal
          isOpen={showClearAllModal}
          title='¿Limpiar todo?'
          message='¿Estás seguro de que quieres eliminar todos los productos de tu lista? Esta acción no se puede deshacer.'
          confirmText='Limpiar todo'
          cancelText='Cancelar'
          variant='danger'
          onConfirm={confirmClearAll}
          onCancel={cancelClearAll}
        />
      </main>
    </>
  )
}

export default App
