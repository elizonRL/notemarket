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
      <div className='max-w-full mx-auto mt-10 p-4 bg-white shadow rounded'>
        <table className='w-full table-auto text-left border-collapse'>
          <thead>
            <tr className='bg-gray-100 text-gray-700'>
              <th className='p-2 border'>Producto</th>
              <th className='p-2 border'>Cantidad</th>
              <th className='p-2 border'>Precio Unitario</th>
              <th className='p-2 border'>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr
                key={i}
                className='hover:bg-gray-50'
              >
                <td className='p-2 border'>{item.name}</td>
                <td className='p-2 border'>{item.quantity} '{item.category}</td>
                <td className='p-2 border'>${item.price.toFixed(2)} </td>
                <td className='p-2 border'>
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className='font-semibold bg-gray-100'>
              <td
                className='p-2 border'
                colSpan={3}
              >
                Total:
              </td>
              <td className='p-2 border'>${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
export default Table
