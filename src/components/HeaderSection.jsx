const Header = () => {
  return (
    <header className='bg-gradient-to-r from-jacarta-600 via-jacarta-500 to-jacarta-700 text-white shadow-xl'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex items-center justify-center'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/>
                <path d="M6 9.01V9"/>
                <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/>
              </svg>
            </div>
            <div className='text-center sm:text-left'>
              <h1 className='font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight'>
                note<span className='text-jacarta-200'>Market</span>
              </h1>
              <p className='text-jacarta-100 text-sm sm:text-base font-light mt-1'>
                Tu asistente de compras inteligente
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header
