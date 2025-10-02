import { useState } from 'react'
import { Input } from './Input'

const FormSection = ({ handleAddProduct, onClose }) => {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({})

  const categories = [
    { id: 1, value: '🥬 Frutas y Verduras' },
    { id: 2, value: '🥛 Lácteos' },
    { id: 3, value: '🍞 Panadería' },
    { id: 4, value: '🍖 Carnes' },
    { id: 5, value: '🥫 Enlatados' },
    { id: 6, value: '🧽 Limpieza' },
    { id: 7, value: '🍪 Snacks' },
    { id: 8, value: '🧊 Congelados' },
    { id: 9, value: '🍚 Arroz y Cereales' }
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!productName.trim()) newErrors.name = 'El nombre es requerido'
    if (!productPrice || productPrice <= 0) newErrors.price = 'El precio debe ser mayor a 0'
    if (!productQuantity || productQuantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0'
    if (!category) newErrors.category = 'Selecciona un tipo'
    return newErrors
  }

  const addProducts = (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length === 0) {
      handleAddProduct({
        name: productName,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity),
        category
      })
      setProductName('')
      setProductPrice('')
      setProductQuantity('')
      setCategory('')
      setErrors({})
      onClose()
    } else {
      setErrors(formErrors)
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
      <form onSubmit={addProducts} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Nombre del producto
            </label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type='text'
              placeholder='Ej: Manzanas rojas'
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Selecciona la categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.value}>{cat.value}</option>
              ))}
            </select>
            {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Cantidad
            </label>
            <Input
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              type='number'
              min='1'
              placeholder='1'
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.quantity && <p className='text-red-500 text-sm mt-1'>{errors.quantity}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Precio ($)
            </label>
            <Input
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              type='number'
              step='0.01'
              min='0.01'
              placeholder='0.00'
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price}</p>}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 pt-4'>
          <button
            type='submit'
            className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-102 shadow-lg'
          >
            ✓ Agregar producto
          </button>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 sm:flex-none bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300'
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormSection
