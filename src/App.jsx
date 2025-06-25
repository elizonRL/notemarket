import { useState } from 'react'
import Table from './components/table'

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
      <header className='bg-blue-700 text-white p-4 '>
        <section className='container mx-auto flex justify-between items-center'>

          <h1 className='font-bold text-2xl'>🛍️ Note super market</h1>
          <nav>
            <ul className='flex space-x-4'>
              <li><a href='#' className='text-white hover:underline'>Home</a></li>
              <li><a href='#' className='text-white hover:underline'>Products</a></li>
              <li><a href='#' className='text-white hover:underline'>About Us</a></li>
              <li><a href='#' className='text-white hover:underline'>Contact</a></li>
            </ul>
          </nav>
        </section>
      </header>
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
                className='border border-gray-300 p-2 rounded w-full mb-2'
              />
              <input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                type='number'
                placeholder='Enter product price'
                className='border border-gray-300 p-2 rounded w-full mb-2'
              />
              <div>
                <button
                  type='submit'
                  className='bg-blue-500 text-white  px-7  rounded hover:bg-blue-600 text-wrap'
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
