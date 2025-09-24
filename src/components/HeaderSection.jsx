const Header = () => {
  return (
    <header className='bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex items-center justify-center'>
          <div className='flex items-center gap-3'>
            <div className='bg-white/20 p-3 rounded-full backdrop-blur-sm'>
              💰
            </div>
            <div className='text-center sm:text-left'>
              <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>
                SmartCart
              </h1>
              <p className='text-blue-100 text-sm sm:text-base font-light'>
                Control inteligente de gastos
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header
