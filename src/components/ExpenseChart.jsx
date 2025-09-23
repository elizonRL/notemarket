const ExpenseChart = ({ products }) => {
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

  const getBarColor = (index) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
      <h3 className='text-xl font-bold text-gray-800 mb-6 text-center'>
        📊 Gastos por producto
      </h3>
      
      <div className='space-y-4'>
        {productExpenses.map((item, index) => (
          <div key={index} className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='font-medium text-gray-700 truncate flex-1 mr-4'>
                {item.name}
              </span>
              <div className='text-right'>
                <span className='font-bold text-gray-900'>${item.total.toFixed(2)}</span>
                <span className='text-sm text-gray-500 ml-2'>
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            
            <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
              <div 
                className={`h-full ${getBarColor(index)} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 pt-4 border-t border-gray-200'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>Gasto total:</span>
          <span className='text-xl font-bold text-green-600'>${totalExpense.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChart