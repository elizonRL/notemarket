import { useState } from 'react'

const FormSection = ({ handleAddProduct }) => {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [category, setCategory] = useState('')
  const addProducts = (e) => {
    e.preventDefault()
    if (productName && productPrice) {
      handleAddProduct({
        name: productName,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity) || 1,
        category: category || 'Uncategorized'
      })
      setProductName('')
      setProductPrice('')
      setProductQuantity('')
      setCategory('')
    }
  }
  return (
    <>
      <form
        className='mb-4 flex flex-col gap-4 sm:flex-row justify-center'
        onSubmit={addProducts}
      >
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          type='text'
          placeholder='Enter product name'
          className='border border-gray-300 p-2 rounded w-2xl mb-2'
        />
        <input
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          type='number'
          placeholder='Enter quantity'
          className='border border-gray-300 p-2 rounded w-2xl mb-2'
        />
        <input
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          type='number'
          placeholder='Enter product price'
          className='border  border-gray-300 p-2 rounded w-2xl mb-2'
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className='border border-gray-300 p-2 rounded w-3xs mb-2'>
          <option value=''>Select Tipe of products</option>
          <option value='Pound'>Pound</option>
          <option value='Units'>Units</option>
        </select>
        <div className='flex gap-4'>
          <button
            type='submit'
            className='bg-blue-500 text-white place-items-center px-6 rounded hover:bg-blue-600 text-wrap'
          >
            Add Product
          </button>
        </div>
      </form>
    </>
  )
}

export default FormSection
