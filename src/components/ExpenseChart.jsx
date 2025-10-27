import { useMemo } from 'react'
import { useChartData } from '../hooks/useChartData.js'
import ChartComponent from './ChartComponet.jsx'
import ListComponent from './ListComponet.jsx'
import ArticleComponent from './ArticleComponent.jsx'
import { useProductContext } from '../contex/productContex'

import { usetotalExpense } from '../hooks/useTotalExpense.js'

const ExpenseChart = () => {
  const { products } = useProductContext()
  if (products.length === 0) return null

  const productExpenses = useMemo(() => products.map(product => ({
    name: product.name,
    total: product.quantity * product.price,
    percentage: 0
  })), [products])

  const totalExpense = useMemo(() => usetotalExpense(productExpenses), [products])

  productExpenses.forEach(item => {
    item.percentage = (item.total / totalExpense) * 100
  })

  productExpenses.sort((productA, productB) => productB.total - productA.total)

  const [dataChart] = useChartData(productExpenses)

  return (
    <ArticleComponent className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
      <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center'>
        📊 Gastos por producto
      </h3>

      <main className='flex flex-col items-center'>
        <ChartComponent dataChart={dataChart} />
        <ListComponent productExpenses={productExpenses} />
      </main>

      <footer className='mt-4 sm:mt-6 pt-4 border-t border-gray-200'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600 text-sm sm:text-base'>Gasto total:</span>
          <span className='text-lg sm:text-xl font-bold text-green-600'>${totalExpense.toFixed(2)}</span>
        </div>
        <div className='text-center mt-2'>
          <span className='text-xs sm:text-sm text-gray-500'>
            {products.length} producto{products.length !== 1 ? 's' : ''} en total
          </span>
        </div>
      </footer>
    </ArticleComponent>
  )
}

export default ExpenseChart
