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
  console.log('[OCR] Texto recibido para parsear:', text)
  
  // Limpiar texto de ruido OCR común (sin eliminar saltos de línea)
  const cleanText = text
    .replace(/[^\x20-\x7E\n\r\táéíóúÁÉÍÓÚñÑÜü]/g, '') // Solo ASCII printable + vocales
    .trim()
  
  // Separar por líneas primero
  const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(l => l)
  console.log('[OCR] Líneas procesadas:', lines)

  let productName = ''
  let price = 0
  let quantity = 1

  // ============================================
  // 1. EXTRAER CANTIDAD - Primero para quitarla del nombre
  // ============================================
  const qtyPatterns = [
    // x5, x 5, X1, x1
    { regex: /\bx[\s]*(\d+)\b/i, extract: 1 },
    // X5 al final
    { regex: /X(\d+)\s*$/im, extract: 1 },
    // 5 unidades, 5 uds, 5 pzas
    { regex: /(\d+)\s*(?:unidades?|uds?|pcs?|pzas?|unds?)/i, extract: 1 },
    // Cant: 5 o Cantidad: 5
    { regex: /(?:cant(?:idad)?|qty)[\s:]*(\d+)/i, extract: 1 },
    // Paquete x 6, Pack 6
    { regex: /(?:paquete|pack|promo)[\s]*x?[\s]*(\d+)/i, extract: 1 },
  ]

  for (const pattern of qtyPatterns) {
    const match = cleanText.match(pattern.regex)
    if (match) {
      const qty = parseInt(match[pattern.extract])
      if (qty > 0 && qty < 100) {
        quantity = qty
        console.log('[OCR] Cantidad detectada:', quantity)
        break
      }
    }
  }

  // ============================================
  // 2. EXTRAER PRECIO - Múltiples patrones
  // ============================================
  const pricePatterns = [
    // PVP $19,90 o PVP $19.90 - formato específico de etiqueta
    { regex: /(?:pvp|precio|val|importe)[\s:]*\$?\s*(\d+)[.,](\d{2})/i, multiplier: 1 },
    // $12.99 o $ 12.99 - formato con punto decimal
    { regex: /\$\s*(\d+)[.,](\d{2})/, multiplier: 1 },
    // 12,99€ o 12.99 (al final de línea)
    { regex: /(\d+)[.,](\d{2})[\s€$]*(?:\s|$)/m, multiplier: 1 },
    // Solo número de 2-4 dígitos que parezca precio (99-9999)
    { regex: /\b(\d{2,4})[.,](\d{2})\b/, multiplier: 1 },
    // Formato sin decimales pero mayor a 10 (probablemente centavos)
    { regex: /\b(\d{3,5})\b/, multiplier: 0.01 },
  ]

  for (const pattern of pricePatterns) {
    const match = cleanText.match(pattern.regex)
    if (match) {
      const whole = match[1]
      const decimals = match[2] || '00'
      const priceStr = `${whole}.${decimals.padEnd(2, '0')}`
      price = parseFloat(priceStr) * pattern.multiplier

      // Filtrar precios válidos (entre $0.10 y $9999)
      if (price >= 0.10 && price < 10000) {
        console.log('[OCR] Precio detectado:', price, 'patrón:', pattern.regex)
        break
      }
    }
  }

  // Si no se detectó precio, intentar con texto normalizado (comas a puntos)
  if (price === 0) {
    const normalizedText = cleanText.replace(/,/g, '.')
    for (const pattern of pricePatterns) {
      const match = normalizedText.match(pattern.regex)
      if (match) {
        const whole = match[1]
        const decimals = match[2] || '00'
        const priceStr = `${whole}.${decimals.padEnd(2, '0')}`
        price = parseFloat(priceStr) * pattern.multiplier

        if (price >= 0.10 && price < 10000) {
          console.log('[OCR] Precio detectado (normalizado):', price)
          break
        }
      }
    }
  }

  // Fallback: buscar cualquier número que parezca precio (entre 1-999)
  if (price === 0) {
    const priceLikeNumbers = cleanText.match(/\b(\d{1,3}[.,]\d{2})\b/g)
    if (priceLikeNumbers) {
      for (const num of priceLikeNumbers) {
        const parsed = parseFloat(num.replace(/,/g, '.'))
        if (parsed >= 1 && parsed < 1000) {
          price = parsed
          console.log('[OCR] Precio detectado (fallback):', price)
          break
        }
      }
    }
  }

  // ============================================
  // 3. EXTRAER NOMBRE DEL PRODUCTO
  // ============================================
  const excludePatterns = [
    // Líneas que empiezan con indicadores de contenido/peso
    /^(?:pes|net|ml|g|kg|l|lt|gr|cc|oz)/i,
    // Indicadores de precio
    /^(?:precio|cantidad|código|sku|ref|pes|peso|descuento|total|subtotal|iva|pvp)/i,
    /^\d+[.,]?\d*$/,                    // Solo números
    /^[$€£¥]\s*\d+/,                     // Solo precio
    /^(?:supermercado|tienda|fecha|lote)/i,
    /^\s*$/,                             // Vacío
  ]

  // Buscar la primera línea que parezca un nombre de producto
  for (const line of lines) {
    // Ignorar líneas que contengan indicadores de contenido/peso
    if (/^(?:pes|net|ml|g|kg|l|lt|gr|cc|oz)/i.test(line)) {
      continue
    }
    
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
        console.log('[OCR] Nombre detectado:', productName)
        break
      }
    }
  }

  // Si no encontramos nombre, buscar línea con letras + números (ej: "Coca Cola 500ml")
  if (!productName || productName.length < 3) {
    for (const line of lines) {
      if (/[a-zA-Z]+\s+\d/.test(line)) {
        productName = line.trim()
        console.log('[OCR] Nombre detectado (fallback letras+números):', productName)
        break
      }
    }
  }

  // Limpiar cantidad del nombre (ej: "ESTUCHE FRESCOL LECHE ENTERA X1" -> "ESTUCHE FRESCOL LECHE ENTERA")
  if (productName) {
    productName = productName.replace(/\s*x\s*\d+\s*$/i, '').trim()
  }

  // ============================================
  // 4. RETORNAR RESULTADO
  // ============================================
  const result = {
    name: productName || 'Producto detectado',
    price: Math.round(price * 100) / 100,  // Redondear a 2 decimales
    quantity: quantity || 1
  }
  
  console.log('[OCR] Resultado final:', result)
  return result
}

export default useOCR
