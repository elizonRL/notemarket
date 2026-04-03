import { useState, useMemo, useEffect, useRef } from 'react'
import { Input } from './Input'
import { IconCheck, IconClose, IconPlus, IconLoader } from './Icons'
import { CATEGORIES } from './Icons/categories'

const FormSection = ({ handleAddProduct, onClose }) => {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [quantityUnit, setQuantityUnit] = useState('unidades')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refs for auto-focus
  const nameInputRef = useRef(null)
  const nameInputId = 'form-product-name'
  const priceInputId = 'form-product-price'
  const quantityInputId = 'form-product-quantity'
  const categorySelectId = 'form-category'

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const nameInput = document.getElementById(nameInputId)
      if (nameInput) nameInput.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Real-time validation function
  const validateField = useMemo(() => {
    return (field, value) => {
      switch (field) {
        case 'name':
          if (!value.trim()) return 'El nombre es requerido'
          if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
          return null
        case 'price':
          if (!value) return null // Don't show error while empty
          {
            const price = parseFloat(value)
            if (isNaN(price) || price <= 0) return 'El precio debe ser mayor a 0'
          }
          return null
        case 'quantity':
          if (!value) return null
          {
            const qty = parseFloat(value)
            if (isNaN(qty) || qty <= 0) return 'La cantidad debe ser mayor a 0'
          }
          return null
        case 'category':
          if (!value) return 'Selecciona una categoría'
          return null
        default:
          return null
      }
    }
  }, [])

  // Handle field changes with real-time validation
  const handleFieldChange = (field, value, setter) => {
    setter(value)

    // Only validate if field has been touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Handle blur - mark as touched and validate
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))

    let value
    switch (field) {
      case 'name': value = productName; break
      case 'price': value = productPrice; break
      case 'quantity': value = productQuantity; break
      case 'category': value = category; break
      default: value = ''
    }

    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // Check if field is valid (touched and no error)
  const isFieldValid = (field) => {
    const value = field === 'name' ? productName
      : field === 'price' ? productPrice
      : field === 'quantity' ? productQuantity
      : category

    // Must have a value and be touched without error
    return touched[field] && value && !errors[field]
  }

  // Maintain quantity based on unit (no conversion)
  const quantityInUnits = useMemo(() => {
    const qty = parseFloat(productQuantity) || 0
    return qty
  }, [productQuantity])

  const validateForm = () => {
    const newErrors = {}
    const nameError = validateField('name', productName)
    const priceError = validateField('price', productPrice)
    const quantityError = validateField('quantity', productQuantity)
    const categoryError = validateField('category', category)

    if (nameError) newErrors.name = nameError
    if (priceError) newErrors.price = priceError
    if (quantityError) newErrors.quantity = quantityError
    if (categoryError) newErrors.category = categoryError

    return newErrors
  }

  const addProducts = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      name: true,
      price: true,
      quantity: true,
      category: true
    })

    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      // Focus first error field
      if (formErrors.name) {
        document.getElementById(nameInputId)?.focus()
      } else if (formErrors.category) {
        document.getElementById(categorySelectId)?.focus()
      } else if (formErrors.quantity) {
        document.getElementById(quantityInputId)?.focus()
      } else if (formErrors.price) {
        document.getElementById(priceInputId)?.focus()
      }
      return
    }

    setIsSubmitting(true)

    try {
      await handleAddProduct({
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
      setTouched({})
      onClose()
    } catch (error) {
      console.error('Error adding product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Display formatted quantity
  const displayQuantity = productQuantity
    ? `${productQuantity} ${quantityUnit === 'unidades' ? 'ud(s)' : 'lb(s)'}`
    : '0'

  // Get shake animation class if field has error
  const getFieldClass = (field, baseClass) => {
    const hasError = touched[field] && errors[field]
    const isValid = isFieldValid(field)

    let className = baseClass

    if (hasError) {
      className += ' animate-shake border-danger-500 bg-danger-50'
    } else if (isValid) {
      className += ' border-success-500 bg-success-50'
    }

    return className
  }

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
            type='button'
            onClick={onClose}
            className='w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors'
            aria-label='Cerrar formulario'
          >
            <IconClose className='w-5 h-5 text-white' />
          </button>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={addProducts} className='p-6 space-y-5'>
        {/* Nombre del producto */}
        <div className='relative'>
          <label htmlFor={nameInputId} className='block text-sm font-semibold text-gray-700 mb-2'>
            Nombre del producto
          </label>
          <div className='relative'>
            <Input
              id={nameInputId}
              ref={nameInputRef}
              value={productName}
              onChange={(e) => handleFieldChange('name', e.target.value, setProductName)}
              onBlur={() => handleBlur('name')}
              type='text'
              placeholder='Ej: Manzana roja orgánica'
              className={getFieldClass('name', 'w-full px-4 py-3.5 pl-11 border-2 rounded-xl focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base border-jacarta-200 hover:border-jacarta-300')}
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-jacarta-400'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
            </div>
            {isFieldValid('name') && (
              <div className='absolute right-4 top-1/2 -translate-y-1/2 text-success-500'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                </svg>
              </div>
            )}
          </div>
          {touched.name && errors.name && (
            <p id='name-error' className='text-danger-600 text-sm mt-1.5 flex items-center gap-1' role='alert'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor={categorySelectId} className='block text-sm font-semibold text-gray-700 mb-2'>
            Categoría
          </label>
          <div className='relative'>
            <select
              id={categorySelectId}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                if (touched.category) {
                  const error = validateField('category', e.target.value)
                  setErrors(prev => ({ ...prev, category: error }))
                }
              }}
              onBlur={() => handleBlur('category')}
              className={getFieldClass('category', 'w-full px-4 py-3.5 border-2 rounded-xl appearance-none cursor-pointer focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base bg-white border-jacarta-200 hover:border-jacarta-300')}
              aria-invalid={touched.category && !!errors.category}
              aria-describedby={errors.category ? 'category-error' : undefined}
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
            {isFieldValid('category') && (
              <div className='absolute right-10 top-1/2 -translate-y-1/2 text-success-500'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                </svg>
              </div>
            )}
          </div>
          {touched.category && errors.category && (
            <p id='category-error' className='text-danger-600 text-sm mt-1.5 flex items-center gap-1' role='alert'>
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
            <label htmlFor={quantityInputId} className='block text-sm font-semibold text-gray-700 mb-2'>
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
                id={quantityInputId}
                value={productQuantity}
                onChange={(e) => handleFieldChange('quantity', e.target.value, setProductQuantity)}
                onBlur={() => handleBlur('quantity')}
                type='number'
                step='0.01'
                min='0.01'
                placeholder='1'
                className={getFieldClass('quantity', 'w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base border-jacarta-200 hover:border-jacarta-300')}
                aria-invalid={touched.quantity && !!errors.quantity}
                aria-describedby={errors.quantity ? 'quantity-error' : undefined}
              />
              <div className='absolute right-4 top-1/2 -translate-y-1/2 text-jacarta-400 text-sm font-medium'>
                {quantityUnit === 'unidades' ? 'ud(s)' : 'lb(s)'}
              </div>
              {isFieldValid('quantity') && (
                <div className='absolute right-12 top-1/2 -translate-y-1/2 text-success-500'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                </div>
              )}
            </div>
            {touched.quantity && errors.quantity && (
              <p id='quantity-error' className='text-danger-600 text-sm mt-1.5'>{errors.quantity}</p>
            )}
          </div>

          <div>
            <label htmlFor={priceInputId} className='block text-sm font-semibold text-gray-700 mb-2'>
              Precio
            </label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-jacarta-400 font-medium'>
                $
              </div>
              <Input
                id={priceInputId}
                value={productPrice}
                onChange={(e) => handleFieldChange('price', e.target.value, setProductPrice)}
                onBlur={() => handleBlur('price')}
                type='number'
                step='0.01'
                min='0.01'
                placeholder='0.00'
                className={getFieldClass('price', 'w-full px-4 py-3.5 pl-8 border-2 rounded-xl focus:ring-2 focus:ring-jacarta-200 focus:border-jacarta-500 transition-all text-base border-jacarta-200 hover:border-jacarta-300')}
                aria-invalid={touched.price && !!errors.price}
                aria-describedby={errors.price ? 'price-error' : undefined}
              />
              {isFieldValid('price') && (
                <div className='absolute right-4 top-1/2 -translate-y-1/2 text-success-500'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                </div>
              )}
            </div>
            {touched.price && errors.price && (
              <p id='price-error' className='text-danger-600 text-sm mt-1.5'>{errors.price}</p>
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
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-jacarta-500 to-jacarta-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-jacarta-600 hover:to-jacarta-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-jacarta-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isSubmitting ? 'cursor-wait' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className='animate-spin-slow w-5 h-5' viewBox='0 0 24 24' fill='none'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                </svg>
                <span>Agregando...</span>
              </>
            ) : (
              <>
                <IconCheck className='w-5 h-5' />
                <span>Agregar</span>
              </>
            )}
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