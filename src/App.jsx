import { useState } from 'react'
import Table from './components/table'
import Header from './components/HeaderSection'

function App () {
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const handleAddProduct = (e) => {
    e.preventDefault()
    if (productName && productPrice) {
      setProducts([...products, { name: productName, price: parseFloat(productPrice) }])
      setProductName('')
      setProductPrice('')
    }
  }
  return (
    <>
      <Header />
      <main>
        <section>
          <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-bold mb-4'>Make your list of products</h2>
            <form className='mb-4 flex flex-col gap-4 sm:flex-row justify-center' onSubmit={handleAddProduct}>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                type='text'
                placeholder='Enter product name'
                className='border border-gray-300 p-2 rounded w-2xl mb-2'
              />
              <input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                type='number'
                placeholder='Enter product price'
                className='border  border-gray-300 p-2 rounded w-2xl mb-2'
              />
              <div className='flex gap-4'>
                <button
                  type='submit'
                  className='bg-blue-500 text-white place-items-center px-6 rounded hover:bg-blue-600 text-wrap'
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </section>
        <section>
          <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-bold mb-4'>Product List</h2>
            {products.length === 0
              ? (
                <p className='text-gray-500 text-center text-5xl'>No products added yet.</p>)
              : <Table products={products} />}

          </div>
        </section>
      </main>
    </>
  )
}

export default App
