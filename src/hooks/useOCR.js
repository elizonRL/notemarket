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
  const lines = text.split('\n').map(l => l.trim()).filter(l => l)
  
  let productName = ''
  let price = 0
  let quantity = 1

  // ============================================
  // 1. EXTRAER PRECIO - Múltiples patrones
  // ============================================
  const pricePatterns = [
    // $12.99 o $ 12.99
    { regex: /\$[\s]*(\d+)[.,](\d{2})/, multiplier: 1 },
    // 12,99€ o 12.99 (al final de línea)
    { regex: /(\d+)[.,](\d{2})[\s€$]*(?:\s|$)/m, multiplier: 1 },
    // Precio: $12.99 o Precio: 12.99
    { regex: /precio[\s:]*\$?\s*(\d+)[.,]?(\d*)/i, multiplier: 1 },
    // PVP: 12.99
    { regex: /(?:pvp|val|importe)[\s:]*\$?\s*(\d+)[.,](\d{2})/i, multiplier: 1 },
    // Solo número de 3-4 dígitos que parezca precio (99-9999)
    { regex: /\b(\d{2,4})[.,](\d{2})\b/, multiplier: 1 },
    // Formato sin decimales pero mayor a 10 (probablemente centavos)
    { regex: /\b(\d{3,5})\b/, multiplier: 0.01 },
  ]

  // Limpiar texto primero
  const cleanText = text.replace(/[^\d.,$\s€£¥PVRpvalIUNmportecantidadxX0-9]/gi, ' ')

  for (const pattern of pricePatterns) {
    const match = cleanText.match(pattern.regex)
    if (match) {
      const whole = match[1]
      const decimals = match[2] || '00'
      const priceStr = `${whole}.${decimals.padEnd(2, '0')}`
      price = parseFloat(priceStr) * pattern.multiplier
      
      // Filtrar precios válidos (entre $0.10 y $9999)
      if (price >= 0.10 && price < 10000) {
        break
      }
    }
  }

  // ============================================
  // 2. EXTRAER CANTIDAD
  // ============================================
  const qtyPatterns = [
    // x5, x 5
    { regex: /x[\s]*(\d+)/i, extract: 1 },
    // 5 unidades, 5 uds, 5 pzas
    { regex: /(\d+)\s*(?:unidades?|uds?|pcs?|pzas?|unds?)/i, extract: 1 },
    // Cant: 5 o Cantidad: 5
    { regex: /(?:cant(?:idad)?|qty)[\s:]*(\d+)/i, extract: 1 },
    // Paquete x 6, Pack 6
    { regex: /(?:paquete|pack|promo)[\s]*x?[\s]*(\d+)/i, extract: 1 },
  ]

  for (const pattern of qtyPatterns) {
    const match = text.match(pattern.regex)
    if (match) {
      const qty = parseInt(match[pattern.extract])
      if (qty > 0 && qty < 100) {
        quantity = qty
        break
      }
    }
  }

  // ============================================
  // 3. EXTRAER NOMBRE DEL PRODUCTO
  // ============================================
  // El nombre suele estar en las primeras líneas o cerca del precio
  
  const excludePatterns = [
    /^(?:precio|cantidad|código|sku|ref|pes|peso|descuento|total|subtotal|iva|pvp)/i,
    /^\d+[.,]?\d*$/,                    // Solo números
    /^[$€£¥]\s*\d+/,                     // Solo precio
    /^(?:supermercado|tienda|fecha|lote)/i,
    /^\s*$/,                             // Vacío
  ]

  // Buscar la primera línea que parezca un nombre de producto
  // (típicamente 2-5 palabras, no muy corta, no solo números)
  for (const line of lines.slice(0, 8)) {  // Primeras 8 líneas
    const isExcluded = excludePatterns.some(pattern => pattern.test(line))
    const hasPrice = /\$\d+/.test(line)
    const isValidLength = line.length >= 3 && line.length <= 60
    
    if (!isExcluded && !hasPrice && isValidLength) {
      // Limpiar el nombre
      productName = line
        .replace(/\s+/g, ' ')           // Espacios múltiples
        .replace(/^[^\w]+/, '')          // Símbolos al inicio
        .trim()
      
      if (productName.length >= 3) {
        break
      }
    }
  }

  // Si no encontramos nombre, buscar línea con letras + números (ej: "Coca Cola 500ml")
  if (!productName || productName.length < 3) {
    for (const line of lines) {
      if (/[a-zA-Z]+\s+\d/.test(line)) {
        productName = line.trim()
        break
      }
    }
  }

  // ============================================
  // 4. RETORNAR RESULTADO
  // ============================================
  return {
    name: productName || 'Producto detectado',
    price: Math.round(price * 100) / 100,  // Redondear a 2 decimales
    quantity: quantity || 1
  }
}

export default useOCR
