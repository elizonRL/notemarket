import { useEffect, useState } from 'react'
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart'

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

  const getBarColor = (index) => {
    const chartColors = [
      '#ef4444', // red-500
      '#3b82f6', // blue-500
      '#10b981', // green-500
      '#f59e0b', // yellow-500
      '#8b5cf6', // purple-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
      '#f97316' // orange-500
    ]
    return chartColors[index % chartColors.length]
  }
  productExpenses.sort((a, b) => b.total - a.total)
  useEffect(() => {
    const data = productExpenses.map((item, index) => ({
      label: item.name + ' ' + '$' + item.total,
      value: item.percentage,
      color: getBarColor(index)
    }))
    setDataChart(data)
  }, [products])

  return (
    <article className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
      <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center'>
        📊 Gastos por producto
      </h3>

      <section className='flex flex-col items-center'>
        <div className='w-full max-w-sm sm:max-w-md lg:max-w-lg'>
          <PieChart
            series={[{
              colors: [],
              data: dataChart,
              arcLabel: (item) => `${item.value.toFixed(1)}%`,
              arcLabelMinAngle: 10,
              cornerRadius: 5,
              arcLabelRadius: '70%',
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
                position: { vertical: 'top', horizontal: 'middle' },
                padding: 0,
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 9,
                itemGap: 4,
                labelStyle: {
                  fontSize: 16,
                  fontWeight: 900
                }
              }
            }}
            sx={
              {
                [`& .${pieArcLabelClasses.root}`]: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  fill: '#ffffff',
                  textShadow: '0 0 3px rgba(0,0,0,0.3)'
                }
              }
            }
          />
        </div>

        {/* Lista de productos para móvil */}
        <div className='w-full mt-4 space-y-2'>
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
