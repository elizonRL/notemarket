const Table = ({ products }) => {
  return (
    <section>
      <div className='container mx-auto p-4'>
        <table className='table-auto w-full mx-auto text-left border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border-b'>Product Name</th>
              <th className='border-b'>Price</th>
            </tr>
          </thead>
          <tbody className='font-semibold capitalize'>
            {products.map((product, index) => (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='px-4 py-2 border-b'>{product.name}</td>
                <td className='px-4 py-2 border-b'>${product.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className='text-gray-500 text-2xl mb-4'>Total Products: {products.length}</p>
    </section>
  )
}
export default Table
