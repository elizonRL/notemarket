const Table = ({ products }) => {
  let total = 0
  if (products.length > 0) {
    total = products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    )
  }
  return (
    <>
      <aside className='min-w-md w-md md:w-full mx-auto mt-10 p-4 bg-white shadow rounded'>
        <div className='flex justify-between items-center bg-gray-100 p-4 rounded-t'>
          <h3>Product</h3>
          <h3>Quantity</h3>
          <h3>Unit Price</h3>
          <h3>Subtotal</h3>
        </div>
        <div className='overflow-x-auto'>
          {products.map((item, i) => (
            <div
              key={i}
              className='flex justify-between items-center p-4 border-b '
            >
              <span>{item.name}</span>
              <span>{item.quantity} {item.category}</span>
              <span>${item.price.toFixed(2)}</span>
              <span>${(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className='flex justify-end items-center p-4  font-semibold bg-gray-100'>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </aside>

    </>
  )
}
export default Table
