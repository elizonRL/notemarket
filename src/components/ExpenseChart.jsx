import { useMemo } from 'react'
import { IconCart } from './Icons'

const ExpenseChart = ({ products }) => {
  if (products.length === 0) return null

  // Calcular gasto por producto
  const productExpenses = useMemo(() => products.map(product => ({
    name: product.name,
    category: product.category,
    total: product.quantity * product.price,
    quantity: product.quantity
  })), [products])

  // Calcular gasto por categoría
  const categoryExpenses = useMemo(() => {
    const categories = {}
    products.forEach(product => {
      const total = product.quantity * product.price
      if (!categories[product.category]) {
        categories[product.category] = { total: 0, count: 0 }
      }
      categories[product.category].total += total
      categories[product.category].count += 1
    })
    return Object.entries(categories)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage: 0
      }))
      .sort((a, b) => b.total - a.total)
  }, [products])

  const totalExpense = productExpenses.reduce((sum, item) => sum + item.total, 0)
  
  categoryExpenses.forEach(item => {
    item.percentage = (item.total / totalExpense) * 100
  })

  // Colores para las categorías
  const categoryColors = {
    '🥬 Frutas y Verduras': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
    '🥛 Lácteos': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
    '🍞 Panadería': { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700' },
    '🍖 Carnes': { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700' },
    '🥫 Enlatados': { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700' },
    '🧽 Limpieza': { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700' },
    '🍪 Snacks': { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' },
    '🧊 Congelados': { bg: 'bg-sky-500', light: 'bg-sky-100', text: 'text-sky-700' },
    '🍚 Arroz y Cereales': { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-700' }
  }

  const getCategoryColor = (category) => {
    return categoryColors[category] || { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700' }
  }

  return (
    <div className='bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100'>
      <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2'>
        <IconCart className="w-5 h-5 text-emerald-600" />
        Resumen de Compras
      </h3>

      {/* Gasto total destacado */}
      <div className='bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 sm:p-6 text-white mb-6 shadow-lg'>
        <div className='text-center'>
          <p className='text-emerald-100 text-sm font-medium mb-1'>Total gastado</p>
          <p className='text-3xl sm:text-4xl font-bold'>${totalExpense.toFixed(2)}</p>
          <div className='mt-3 flex justify-center gap-4 text-sm'>
            <span className='bg-white/20 px-3 py-1 rounded-full'>
              {products.length} productos
            </span>
            <span className='bg-white/20 px-3 py-1 rounded-full'>
              {categoryExpenses.length} categorías
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico de barras por categoría */}
      <div className='space-y-4 mb-6'>
        <h4 className='font-semibold text-gray-700 text-sm uppercase tracking-wide'>
          Gasto por categoría
        </h4>
        
        {categoryExpenses.map((item, index) => {
          const colors = getCategoryColor(item.category)
          return (
            <div key={index} className='space-y-1'>
              <div className='flex justify-between items-center text-sm'>
                <span className='font-medium text-gray-700 flex items-center gap-2'>
                  <span className={`w-3 h-3 rounded-full ${colors.bg}`}></span>
                  {item.category}
                </span>
                <span className='font-bold text-gray-800'>
                  ${item.total.toFixed(2)}
                  <span className='text-gray-400 font-normal ml-1'>
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className='h-3 bg-gray-100 rounded-full overflow-hidden'>
                <div 
                  className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista de productos */}
      <div className='border-t border-gray-200 pt-4'>
        <h4 className='font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3'>
          Detalle de productos
        </h4>
        
        <div className='space-y-2 max-h-64 overflow-y-auto'>
          {productExpenses
            .sort((a, b) => b.total - a.total)
            .map((item, index) => {
              const colors = getCategoryColor(item.category)
              return (
                <div 
                  key={index} 
                  className='flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.bg}`}></span>
                    <span className='font-medium text-gray-700 text-sm truncate'>
                      {item.name}
                    </span>
                    <span className='text-gray-400 text-xs flex-shrink-0'>
                      x{item.quantity}
                    </span>
                  </div>
                  <span className='font-bold text-gray-800 text-sm ml-2'>
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Stats adicionales */}
      <div className='mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4'>
        <div className='text-center p-3 bg-gray-50 rounded-xl'>
          <p className='text-gray-500 text-xs uppercase'>Promedio por producto</p>
          <p className='font-bold text-emerald-600'>
            ${(totalExpense / products.length).toFixed(2)}
          </p>
        </div>
        <div className='text-center p-3 bg-gray-50 rounded-xl'>
          <p className='text-gray-500 text-xs uppercase'>Categoría principal</p>
          <p className='font-bold text-gray-800 text-sm'>
            {categoryExpenses[0]?.category || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChart
