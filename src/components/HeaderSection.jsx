const Header = () => {
  return (
    <header className='bg-blue-700 text-white p-4 '>
      <section className='container mx-auto flex md:justify-between items-center'>

        <h1 className='font-bold text-2xl'>🛍️ Note super market</h1>
        <nav>
          <ul className='flex space-x-4'>
            <li><a href='#' className='text-white hover:underline'>Home</a></li>
            <li><a href='#' className='text-white hover:underline'>Products</a></li>
            <li><a href='#' className='text-white hover:underline'>About Us</a></li>
            <li><a href='#' className='text-white hover:underline'>Contact</a></li>
          </ul>
        </nav>
      </section>
    </header>
  )
}
export default Header
