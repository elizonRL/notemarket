import { useState } from 'react'
import Table from '@/Table'
import Header from '@/HeaderSection'
import FormSection from '@/FormSection'
import ExpenseChart from '@/ExpenseChart'
import BudgetControl from '@/BudgetControl'
import { useProductContext } from './contex/productContex'

function App () {
  /* const [products, setProducts] = useState([]) */
  const [showForm, setShowForm] = useState(false)
  const { products, setProducts } = useProductContext()

  const handleAddProduct = (Product) => {
    setProducts((prevProducts) => [...prevProducts, Product])
  }

  return (
    <>
      <Header />

      <main>
        <section className='px-4 py-6'>
          <div className='max-w-4xl mx-auto space-y-6'>
            <BudgetControl />

            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-4 text-gray-800'>
                🛍️ Mi Carrito de Compras
              </h2>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium'
                >
                  {showForm ? '✕ Cerrar formulario' : '+ Agregar producto'}
                </button>
                {/*  {products.length > 0 && (
                  <div className='bg-green-100 text-green-800 px-6 py-3 rounded-lg font-bold'>
                    Total: ${totalSpent.toFixed(2)}
                  </div>
                )} */}
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
                  <div className='text-6xl mb-4'>📦</div>
                  <p className='text-gray-500 text-xl'>No hay productos agregados aún</p>
                  <p className='text-gray-400 text-sm mt-2'>Haz clic en "Agregar producto" para comenzar</p>
                </div>
                )
              : (
                <>
                  <Table />
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
