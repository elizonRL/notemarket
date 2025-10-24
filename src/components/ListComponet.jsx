const ListComponent = ({ productExpenses }) => {
  return (
    <>
      <div className='w-full mt-4 space-y-2'>
        {productExpenses.map((porductItem, index) => (
          <div key={index} className='flex justify-between items-center p-2 bg-gray-50 rounded-lg'>
            <span className='font-medium text-gray-700 text-sm truncate flex-1 mr-2'>
              {porductItem.name}
            </span>
            <div className='text-right'>
              <span className='font-bold text-gray-900 text-sm'>${porductItem.total.toFixed(2)}</span>
              <span className='text-xs text-gray-500 ml-1'>
                ({porductItem.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
export default ListComponent
