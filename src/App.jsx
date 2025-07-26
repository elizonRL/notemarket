import { useState } from 'react'
import Table from './components/table'
import Header from './components/HeaderSection'
import FormSection from './components/FormSection'

function App () {
  const [products, setProducts] = useState([])

  const handleAddProduct = (Product) => {
    setProducts((prevProducts) => [...prevProducts, Product])
  }
  return (
    <>
      <Header />
      <main>
        <section>
          <div className='p-4'>
            <h2 className='text-2xl font-bold mb-4'>
              Make your list of products
            </h2>
            <FormSection handleAddProduct={handleAddProduct} />
          </div>
        </section>
        <section>
          <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-bold mb-4'>Product List</h2>
            {products.length === 0
              ? (
                <p className='text-gray-500 text-center text-5xl'> No products added yet. </p>
                )
              : (
                <Table products={products} />
                )}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
