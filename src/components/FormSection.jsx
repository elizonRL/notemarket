import { useState, useMemo } from 'react'
import { Input } from './Input'
import { IconCheck, IconClose, IconPlus } from './Icons'
import { CATEGORIES } from './Icons/categories'

const FormSection = ({ handleAddProduct, onClose }) => {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [quantityUnit, setQuantityUnit] = useState('unidades') // 'unidades' o 'libras'
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({})

  // Mantener cantidad según la unidad seleccionada (sin convertir)
  const quantityInUnits = useMemo(() => {
    const qty = parseFloat(productQuantity) || 0
    return qty // Se guarda tal cual: libras = libras, unidades = unidades
  }, [productQuantity])

  const validateForm = () => {
    const newErrors = {}
    if (!productName.trim()) newErrors.name = 'El nombre es requerido'
    if (!productPrice || parseFloat(productPrice) <= 0) newErrors.price = 'El precio debe ser mayor a 0'
    if (!productQuantity || parseFloat(productQuantity) <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0'
    if (!category) newErrors.category = 'Selecciona una categoría'
    return newErrors
  }

  const addProducts = (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length === 0) {
      handleAddProduct({
        name: productName,
        price: parseFloat(productPrice),
        quantity: quantityInUnits,
        quantityDisplay: `${productQuantity} ${quantityUnit}`,
        category
      })
      setProductName('')
      setProductPrice('')
      setProductQuantity('')
      setQuantityUnit('unidades')
      setCategory('')
      setErrors({})
      onClose()
    } else {
      setErrors(formErrors)
    }
  }

  // Mostrar cantidad formateada
  const displayQuantity = productQuantity
    ? `${productQuantity} ${quantityUnit === 'unidades' ? 'ud(s)' : 'lb(s)'}`
    : '0'

  return (
    <div className='bg-white rounded-2xl shadow-xl border border-jacarta-100 overflow-hidden'>
      {/* Header del formulario */}
      <div className='bg-gradient-to-r from-jacarta-500 to-jacarta-600 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center'>
              <IconPlus className='w-5 h-5 text-white' />
            </div>
            <div>
              <h3 className='text-white font-bold text-lg'>Nuevo Producto</h3>
              <p className='text-jacarta-100 text-sm'>Agrega un artículo a tu lista</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors'
          >
            <IconClose className='w-5 h-5 text-white' />
          </button>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={addProducts} className='p-6 space-y-5'>
        {/* Nombre del producto */}
        <div className='relative'>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Nombre del producto
          </label>
          <div className='relative'>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type='text'
              placeholder='Ej: Manzana roja orgánica'
              className={`w-full px-4 py-3.5 pl-11 border-2 rounded-xl focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base ${errors.name ? 'border-danger-500 bg-danger-50' : 'border-jacarta-200 hover:border-jacarta-300'
                }`}
            />
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-jacarta-400'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
            </div>
          </div>
          {errors.name && (
            <p className='text-danger-600 text-sm mt-1.5 flex items-center gap-1'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Categoría
          </label>
          <div className='relative'>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3.5 border-2 rounded-xl appearance-none cursor-pointer focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base bg-white ${errors.category ? 'border-danger-500 bg-danger-50' : 'border-jacarta-200 hover:border-jacarta-300'
                }`}
            >
              <option value=''>Selecciona una categoría...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.value} className='py-2'>
                  {cat.icon} {cat.value}
                </option>
              ))}
            </select>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-jacarta-400'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
              </svg>
            </div>
          </div>
          {errors.category && (
            <p className='text-danger-600 text-sm mt-1.5 flex items-center gap-1'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
              {errors.category}
            </p>
          )}
        </div>

        {/* Cantidad (con toggle unidades/libras) y Precio */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Cantidad
            </label>

            {/* Toggle unidades/libras */}
            <div className='flex mb-2 bg-gray-100 rounded-lg p-1'>
              <button
                type='button'
                onClick={() => setQuantityUnit('unidades')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${quantityUnit === 'unidades'
                    ? 'bg-white text-jacarta-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Unidades
              </button>
              <button
                type='button'
                onClick={() => setQuantityUnit('libras')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${quantityUnit === 'libras'
                    ? 'bg-white text-jacarta-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Libras
              </button>
            </div>

            <div className='relative'>
              <Input
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                type='number'
                step='0.01'
                min='0.01'
                placeholder='1'
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base ${errors.quantity ? 'border-danger-500 bg-danger-50' : 'border-jacarta-200 hover:border-jacarta-300'
                  }`}
              />
              <div className='absolute right-4 top-1/2 -translate-y-1/2 text-jacarta-400 text-sm font-medium'>
                {quantityUnit === 'unidades' ? 'ud(s)' : 'lb(s)'}
              </div>
            </div>
            {errors.quantity && (
              <p className='text-danger-600 text-sm mt-1.5'>{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Precio
            </label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-jacarta-400 font-medium'>
                $
              </div>
              <Input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                type='number'
                step='0.01'
                min='0.01'
                placeholder='0.00'
                className={`w-full px-4 py-3.5 pl-8 border-2 rounded-xl focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base ${errors.price ? 'border-danger-500 bg-danger-50' : 'border-jacarta-200 hover:border-jacarta-300'
                  }`}
              />
            </div>
            {errors.price && (
              <p className='text-danger-600 text-sm mt-1.5'>{errors.price}</p>
            )}
          </div>
        </div>

        {/* Preview */}
        {(productName || productPrice) && (
          <div className='bg-jacarta-50 rounded-xl p-4 border border-jacarta-200'>
            <p className='text-xs font-medium text-jacarta-600 mb-2 uppercase tracking-wide'>Vista previa</p>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-semibold text-gray-800'>{productName || 'Sin nombre'}</p>
                <p className='text-sm text-gray-500'>
                  {displayQuantity} x ${productPrice || '0.00'}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-xl font-bold text-jacarta-600'>
                  ${((parseFloat(productQuantity) || 0) * (parseFloat(productPrice) || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className='flex flex-col sm:flex-row gap-3 pt-2'>
          <button
            type='submit'
            className='flex-1 bg-gradient-to-r from-jacarta-500 to-jacarta-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-jacarta-600 hover:to-jacarta-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-jacarta-500/25 flex items-center justify-center gap-2'
          >
            <IconCheck className='w-5 h-5' />
            <span>Agregar</span>
          </button>

          <button
            type='button'
            onClick={onClose}
            className='flex-1 sm:flex-none bg-gray-100 text-gray-600 py-3.5 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2'
          >
            <IconClose className='w-5 h-5' />
            <span className='text-sm'>Cancelar</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormSection
