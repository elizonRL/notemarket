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
  const [isFormClosing, setIsFormClosing] = useState(false)

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

  const handleClearAll = () => {
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

  // Handle form toggle with animation
  const handleToggleForm = () => {
    if (showForm) {
      setIsFormClosing(true)
      setTimeout(() => {
        setShowForm(false)
        setIsFormClosing(false)
      }, 300)
    } else {
      setShowForm(true)
    }
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className='space-y-6 animate-fadeIn'>
      {/* Budget skeleton */}
      <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100'>
        <div className='h-6 w-32 bg-gray-200 rounded animate-skeleton mb-4' />
        <div className='h-4 w-full bg-gray-200 rounded animate-skeleton' />
        <div className='h-4 w-2/3 bg-gray-200 rounded animate-skeleton mt-2' />
      </div>

      {/* Products skeleton */}
      <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
        <div className='hidden md:grid md:grid-cols-6 bg-gradient-to-r from-jacarta-50 to-jacarta-100 p-4'>
          <div className='h-4 w-16 bg-gray-200 rounded animate-skeleton' />
          <div className='h-4 w-16 bg-gray-200 rounded animate-skeleton mx-auto' />
          <div className='h-4 w-16 bg-gray-200 rounded animate-skeleton mx-auto' />
          <div className='h-4 w-16 bg-gray-200 rounded animate-skeleton mx-auto' />
          <div className='h-4 w-16 bg-gray-200 rounded animate-skeleton mx-auto' />
          <div className='h-4 w-16 bg-gray-200 rounded animate-skeleton mx-auto' />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className='p-4 animate-slideInUp' style={{ animationDelay: `${i * 100}ms` }}>
            <div className='hidden md:grid md:grid-cols-6 items-center gap-4'>
              <div className='h-5 w-3/4 bg-gray-200 rounded animate-skeleton' />
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
          </div>
        ))}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <>
        <Header />
        <main className='px-4 py-6'>
          <div className='max-w-4xl mx-auto'>
            <LoadingSkeleton />
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
                  onClick={handleToggleForm}
                  className='bg-gradient-to-r from-jacarta-500 to-jacarta-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-jacarta-600 hover:to-jacarta-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center gap-2 active:scale-95'
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
                      className='bg-gradient-to-r from-warm-500 to-warm-600 text-white px-4 py-3 rounded-xl shadow-md hover:from-warm-600 hover:to-warm-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95'
                      title='Generar factura PDF'
                    >
                      <IconDownload className='w-5 h-5' />
                      <span className='hidden sm:inline'>PDF</span>
                    </button>

                    <button
                      onClick={handleClearAll}
                      className='bg-danger-500 text-white px-4 py-3 rounded-xl shadow-md hover:bg-danger-600 transition-all duration-300 font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95'
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

            {/* Formulario con animación */}
            {showForm && (
              <div className={`transition-all duration-300 ease-out ${isFormClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <FormSection handleAddProduct={handleAddProduct} onClose={handleToggleForm} />
              </div>
            )}
          </div>
        </section>
        <section className='px-4 py-6'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Lista de productos</h2>
            {products.length === 0
              ? (
                <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn'>
                  <div className='py-12 text-center'>
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
                    <h3 className='text-xl font-semibold text-gray-700 mb-2'>No hay productos agregados aún</h3>
                    <p className='text-gray-400 text-sm'>Haz clic en &quot;Agregar producto&quot; para comenzar</p>
                  </div>
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