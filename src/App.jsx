import { useState } from 'react'
import Table from '@components/Table'
import Header from '@components/HeaderSection'
import FormSection from '@components/FormSection'
import ExpenseChart from '@components/ExpenseChart'
import BudgetControl from '@components/BudgetControl'
import { IconPlus, IconClose, IconCart, IconEmpty, IconMoney } from '@components/Icons'

function App () {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)

  const handleAddProduct = (Product) => {
    setProducts((prevProducts) => [...prevProducts, Product])
  }

  const handleUpdateProduct = (index, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) => i === index ? updatedProduct : product)
    )
  }

  const handleDeleteProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index))
  }

  const totalSpent = products.reduce((sum, product) => sum + (product.quantity * product.price), 0)
  return (
    <>
      <Header />
      <main>
        <section className='px-4 py-6'>
          <div className='max-w-4xl mx-auto space-y-6'>
            <BudgetControl totalSpent={totalSpent} />

            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2'>
                <IconCart className="w-6 h-6 text-emerald-600" />
                Mi Carrito de Compras
              </h2>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className='bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center gap-2'
                >
                  {showForm 
                    ? <><IconClose className="w-5 h-5" /> Cerrar</>
                    : <><IconPlus className="w-5 h-5" /> Agregar producto</>
                  }
                </button>
                {products.length > 0 && (
                  <div className='bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2'>
                    <IconMoney className="w-5 h-5" />
                    Total: ${totalSpent.toFixed(2)}
                  </div>
                )}
              </div>
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
                    <IconEmpty className="w-16 h-16 text-gray-300" />
                  </div>
                  <p className='text-gray-500 text-xl'>No hay productos agregados aun</p>
                  <p className='text-gray-400 text-sm mt-2'>Haz clic en "Agregar producto" para comenzar</p>
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
      </main>
    </>
  )
}

export default App
