import { useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
const ExpenseChart = ({ products }) => {
  const [dataChart, setDataChart] = useState([])
  if (products.length === 0) return null

  const productExpenses = products.map(product => ({
    name: product.name,
    total: product.quantity * product.price,
    percentage: 0
  }))

  const totalExpense = productExpenses.reduce((sum, item) => sum + item.total, 0)

  productExpenses.forEach(item => {
    item.percentage = (item.total / totalExpense) * 100
  })

  productExpenses.sort((a, b) => b.total - a.total)
  useEffect(() => {
    const data = productExpenses.map(item => ({
      label: item.name + ' ' + '$' + item.total,
      value: item.percentage
    }))
    setDataChart(data)
  }, [products])
  /* const getBarColor = (index) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ]
    return colors[index % colors.length]
  } */

  return (
    <article className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
      <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center'>
        📊 Gastos por producto
      </h3>

      <section className='flex flex-col items-center'>
        <div className='w-full max-w-sm sm:max-w-md lg:max-w-lg'>
          <PieChart
            series={[{
              data: dataChart,
              arcLabel: (item) => `${item.label} (${item.value.toFixed(1)}%)`,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
            }]}
            width={320}
            height={320}
            className='w-full h-auto'
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 8,
                itemGap: 4,
                labelStyle: {
                  fontSize: 12,
                  fontWeight: 500
                }
              },
              arcLabel: {
                fontSize: 12,
                fill: '#ffffff',
                color: '#ffffff',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeWidth: 0.5
              }
            }}
          />
        </div>

        {/* Lista de productos para móvil */}
        <div className='w-full mt-4 space-y-2 sm:hidden'>
          {productExpenses.slice(0, 5).map((item, index) => (
            <div key={index} className='flex justify-between items-center p-2 bg-gray-50 rounded-lg'>
              <span className='font-medium text-gray-700 text-sm truncate flex-1 mr-2'>
                {item.name}
              </span>
              <div className='text-right'>
                <span className='font-bold text-gray-900 text-sm'>${item.total.toFixed(2)}</span>
                <span className='text-xs text-gray-500 ml-1'>
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='mt-4 sm:mt-6 pt-4 border-t border-gray-200'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600 text-sm sm:text-base'>Gasto total:</span>
          <span className='text-lg sm:text-xl font-bold text-green-600'>${totalExpense.toFixed(2)}</span>
        </div>
        <div className='text-center mt-2'>
          <span className='text-xs sm:text-sm text-gray-500'>
            {products.length} producto{products.length !== 1 ? 's' : ''} en total
          </span>
        </div>
      </section>
    </article>
  )
}

export default ExpenseChart
