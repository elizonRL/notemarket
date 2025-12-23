import { createContext, useContext, useState } from 'react'

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const newProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product])
  }
  return (
    <ProductContext.Provider value={{ products, newProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  return useContext(ProductContext)
}
