import { useState, useCallback } from 'react'
import Tesseract from 'tesseract.js'

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const processImage = useCallback(async (imageSource) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const result = await Tesseract.recognize(imageSource, 'spa+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })

      const text = result.data.text
      const parsedData = parseProductText(text)

      return {
        success: true,
        rawText: text,
        ...parsedData
      }
    } catch (err) {
      setError(err.message)
      return {
        success: false,
        error: err.message
      }
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [])

  return {
    processImage,
    isProcessing,
    progress,
    error
  }
}

function parseProductText(text) {
  const lines = text.split('\n').filter(line => line.trim())
  
  let productName = ''
  let price = 0
  let quantity = 1

  // Buscar precio (patrones: $123.45, 123.45, Precio: 123)
  const pricePatterns = [
    /\$[\s]*(\d+[.,]\d{2})/,
    /precio[\s:]*\$?\s*(\d+[.,]\d{2})/i,
    /\b(\d+[.,]\d{2})\s*$/m,
    /(\d{3,4}[.,]\d{2})/
  ]

  for (const pattern of pricePatterns) {
    const match = text.match(pattern)
    if (match) {
      const priceStr = match[1].replace(',', '.')
      price = parseFloat(priceStr)
      if (price > 0 && price < 10000) break
    }
  }

  // Buscar cantidad
  const qtyPatterns = [
    /(\d+)\s*(?:unidades?|uds?|pcs?|pzas?|cant|cantidad)/i,
    /x(\d+)/i,
    /(?:cantidad|cant)[\s:]*(\d+)/i
  ]

  for (const pattern of qtyPatterns) {
    const match = text.match(pattern)
    if (match) {
      quantity = parseInt(match[1])
      if (quantity > 0) break
    }
  }

  // El nombre es usually la primera línea significativa
  for (const line of lines) {
    const cleanLine = line.trim()
    if (cleanLine.length > 2 && 
        !cleanLine.match(/^\d+[.,]?\d*$/) && 
        !cleanLine.match(/^\$/)) {
      productName = cleanLine
      break
    }
  }

  return {
    name: productName || 'Producto detectado',
    price: price || 0,
    quantity: quantity || 1
  }
}

export default useOCR
