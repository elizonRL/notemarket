import { useState, useEffect, useCallback } from 'react'

// ============================================
// STORAGE CONFIG - Preparado para API futura
// ============================================
const STORAGE_KEY = 'notemarket_products'

// Toggle entre 'local' y 'api' según necesites
const STORAGE_MODE = 'local' // Cambiar a 'api' cuando tengas backend

// ============================================
// API CONFIG (para cuando implementes backend)
// ============================================
const API_CONFIG = {
  baseUrl: '/api',
  endpoints: {
    products: '/products',
  },
  // Simular delay de API
  delay: 500,
}

// ============================================
// FUNCIONES DE STORAGE (LOCAL)
// ============================================
const localStorageOps = {
  getAll: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return []
    }
  },

  save: (products) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },
}

// ============================================
// FUNCIONES DE API (FUTURO)
// ============================================
const apiOps = {
  getAll: async () => {
    // TODO: Implementar cuando tengas backend
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}`)
    // return await response.json()
    console.warn('API not implemented yet - using localStorage')
    return localStorageOps.getAll()
  },

  save: async (products) => {
    // TODO: Implementar cuando tengas backend
    // await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(products)
    // })
    console.warn('API not implemented yet - using localStorage')
    return localStorageOps.save(products)
  },

  clear: async () => {
    // TODO: Implementar cuando tengas backend
    // await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}`, {
    //   method: 'DELETE'
    // })
    console.warn('API not implemented yet - using localStorage')
    return localStorageOps.clear()
  },
}

// ============================================
// SELECTOR DE MODO
// ============================================
const storageOps = STORAGE_MODE === 'api' ? apiOps : localStorageOps

// ============================================
// HOOK PERSONALIZADO
// ============================================
export const useProductStorage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos al iniciar
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await storageOps.getAll()
        setProducts(data)
      } catch (err) {
        setError(err.message)
        console.error('Error loading products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Guardar productos cuando cambien
  const saveProducts = useCallback(async (newProducts) => {
    setError(null)
    try {
      const success = await storageOps.save(newProducts)
      if (success) {
        setProducts(newProducts)
        return true
      }
      throw new Error('Failed to save products')
    } catch (err) {
      setError(err.message)
      console.error('Error saving products:', err)
      return false
    }
  }, [])

  // Agregar producto
  const addProduct = useCallback(async (product) => {
    const newProducts = [...products, product]
    return saveProducts(newProducts)
  }, [products, saveProducts])

  // Actualizar producto
  const updateProduct = useCallback(async (index, updatedProduct) => {
    const newProducts = products.map((p, i) => (i === index ? updatedProduct : p))
    return saveProducts(newProducts)
  }, [products, saveProducts])

  // Eliminar producto
  const deleteProduct = useCallback(async (index) => {
    const newProducts = products.filter((_, i) => i !== index)
    return saveProducts(newProducts)
  }, [products, saveProducts])

  // Limpiar todo
  const clearAll = useCallback(async () => {
    setError(null)
    try {
      const success = await storageOps.clear()
      if (success) {
        setProducts([])
        return true
      }
      throw new Error('Failed to clear products')
    } catch (err) {
      setError(err.message)
      console.error('Error clearing products:', err)
      return false
    }
  }, [])

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAll,
    storageMode: STORAGE_MODE,
  }
}

// ============================================
// EXPORTAR CONFIG PARA USO EXTERNO
// ============================================
export { STORAGE_KEY, STORAGE_MODE, API_CONFIG }
