const Table = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const total = products.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  )

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity > 0) {
      onUpdateProduct(index, { ...products[index], quantity: parseInt(newQuantity) })
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
      {/* Header para desktop */}
      <div className='hidden md:grid md:grid-cols-6 bg-gradient-to-r from-gray-50 to-gray-100 p-4 font-semibold text-gray-700 border-b'>
        <div>Producto</div>
        <div className='text-center'>Categoría</div>
        <div className='text-center'>Cantidad</div>
        <div className='text-center'>Precio unitario</div>
        <div className='text-center'>Subtotal</div>
        <div className='text-center'>Acciones</div>
      </div>

      {/* Productos */}
      <div className='divide-y divide-gray-100'>
        {products.map((item, i) => (
          <div key={i} className='p-4 hover:bg-gray-50 transition-colors duration-200'>
            {/* Vista desktop */}
            <div className='hidden md:grid md:grid-cols-6 items-center gap-4'>
              <div className='font-medium text-gray-900'>{item.name}</div>
              <div className='text-center'>
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {item.category}
                </span>
              </div>
              <div className='text-center'>
                <input
                  type='number'
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(i, e.target.value)}
                  className='w-16 px-2 py-1 border border-gray-300 rounded text-center'
                  min='1'
                />
              </div>
              <div className='text-center text-green-600 font-semibold'>${item.price.toFixed(2)}</div>
              <div className='text-center font-bold text-gray-900'>${(item.quantity * item.price).toFixed(2)}</div>
              <div className='text-center'>
                <button
                  onClick={() => onDeleteProduct(i)}
                  className='text-red-500 hover:text-red-700 p-1'
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Vista móvil */}
            <div className='md:hidden space-y-3'>
              <div className='flex justify-between items-start'>
                <h3 className='font-semibold text-gray-900 flex-1'>{item.name}</h3>
                <button
                  onClick={() => onDeleteProduct(i)}
                  className='text-red-500 hover:text-red-700 ml-2'
                >
                  🗑️
                </button>
              </div>
              <div className='flex justify-between items-center'>
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {item.category}
                </span>
                <span className='font-bold text-gray-900'>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
              <div className='flex justify-between items-center text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <span>Cantidad:</span>
                  <div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1'>
                    <button
                      onClick={() => handleQuantityChange(i, item.quantity - 1)}
                      className='w-8 h-8 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 flex items-center justify-center'
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className='w-8 text-center font-bold'>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(i, item.quantity + 1)}
                      className='w-8 h-8 bg-green-500 text-white rounded-md font-bold hover:bg-green-600 flex items-center justify-center'
                    >
                      +
                    </button>
                  </div>
                </div>
                <span>${item.price.toFixed(2)} c/u</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className='bg-gradient-to-r from-green-50 to-green-100 p-4 border-t-2 border-green-200'>
        <div className='flex justify-between items-center'>
          <span className='text-lg font-semibold text-gray-700'>Total general:</span>
          <span className='text-2xl font-bold text-green-600'>${total.toFixed(2)}</span>
        </div>
        <div className='text-sm text-gray-500 mt-1'>
          {products.length} producto{products.length !== 1 ? 's' : ''} en total
        </div>
      </div>
    </div>
  )
}
export default Table
