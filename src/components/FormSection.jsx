import { useState } from 'react'
import { Input } from './Input'
import OCRScanner from './OCRScanner'
import { IconCheck, IconScan, IconClose } from './Icons'

const FormSection = ({ handleAddProduct, onClose }) => {
  const [showOCR, setShowOCR] = useState(false)

  const handleOCRScanComplete = (data) => {
    setProductName(data.name)
    setProductPrice(data.price > 0 ? data.price.toString() : '')
    setProductQuantity(data.quantity > 0 ? data.quantity.toString() : '1')
    setShowOCR(false)
  }
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({})

  const categories = [
    { id: 1, value: 'Frutas y Verduras', icon: 'frutas' },
    { id: 2, value: 'Lácteos', icon: 'dairy' },
    { id: 3, value: 'Panadería', icon: 'bakery' },
    { id: 4, value: 'Carnes', icon: 'meat' },
    { id: 5, value: 'Pescados y Mariscos', icon: 'fish' },
    { id: 6, value: 'Fiambres y Embutidos', icon: 'ham' },
    { id: 7, value: 'Bebidas', icon: 'drinks' },
    { id: 8, value: 'Congelados', icon: 'frozen' },
    { id: 9, value: 'Enlatados', icon: 'canned' },
    { id: 10, value: 'Arroz, Pasta y Cereales', icon: 'rice' },
    { id: 11, value: 'Aceites y Aderezos', icon: 'oil' },
    { id: 12, value: 'Condimentos y Especias', icon: 'spices' },
    { id: 13, value: 'Café, Té y Chocolate', icon: 'coffee' },
    { id: 14, value: 'Galletitas y Dulces', icon: 'cookies' },
    { id: 15, value: 'Limpieza', icon: 'cleaning' },
    { id: 16, value: 'Higiene Personal', icon: 'hygiene' },
    { id: 17, value: 'Perfumería', icon: 'perfume' },
    { id: 18, value: 'Otros', icon: 'other' }
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
            className='flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-102 shadow-lg flex items-center justify-center gap-2'
          >
            <IconCheck className="w-5 h-5" />
            Agregar producto
          </button>
          <button
            type='button'
            onClick={() => setShowOCR(true)}
            className='flex-1 sm:flex-none bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2'
          >
            <IconScan className="w-5 h-5" />
            Escanear
          </button>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2'
          >
            <IconClose className="w-5 h-5" />
            Cancelar
          </button>
        </div>
      </form>

      {showOCR && (
        <OCRScanner
          onScanComplete={handleOCRScanComplete}
          onClose={() => setShowOCR(false)}
        />
      )}
    </div>
  )
}

export default FormSection
