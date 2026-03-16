import { jsPDF } from 'jspdf'

// ============================================
// GENERADOR DE FACTURAS PDF
// ============================================

/**
 * Genera un PDF con la lista de productos tipo factura
 * @param {Array} products - Array de productos
 * @param {number} total - Total gastado
 * @param {string} filename - Nombre del archivo (opcional)
 */
export const generateInvoicePDF = (products, total, filename = 'notemarket-factura') => {
  // Crear documento PDF
  const doc = new jsPDF()
  
  // Colores
  const primaryColor = [103, 109, 202] // Jacarta #676dca
  const textDark = [51, 51, 51]
  const textGray = [128, 128, 128]
  
  // ============================================
  // HEADER
  // ============================================
  
  // Barra decorativa superior
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 25, 'F')
  
  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('noteMarket', 15, 17)
  
  // Subtítulo
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Lista de Compras', 15, 22)
  
  // Fecha
  const fecha = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const hora = new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  doc.text(`Fecha: ${fecha} ${hora}`, 195, 17, { align: 'right' })
  
  // ============================================
  // TABLA DE PRODUCTOS
  // ============================================
  
  let yPos = 40
  const marginLeft = 15
  const pageWidth = 180
  
  // Encabezados de columna
  doc.setFillColor(243, 243, 251) // jacarta-50
  doc.rect(marginLeft, yPos - 5, pageWidth, 10, 'F')
  
  doc.setTextColor(...textDark)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  
  doc.text('Producto', marginLeft + 5, yPos)
  doc.text('Categoría', marginLeft + 70, yPos)
  doc.text('Cant.', marginLeft + 115, yPos)
  doc.text('Precio', marginLeft + 135, yPos)
  doc.text('Subtotal', marginLeft + 160, yPos)
  
  yPos += 10
  
  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.line(marginLeft, yPos, marginLeft + pageWidth, yPos)
  
  yPos += 5
  
  // Productos
  doc.setFont('helvetica', 'normal')
  
  products.forEach((product, index) => {
    // Alternar colores de fila
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 255)
      doc.rect(marginLeft, yPos - 4, pageWidth, 8, 'F')
    }
    
    doc.setTextColor(...textDark)
    
    // Nombre del producto (truncar si es muy largo)
    let nombre = product.name
    if (nombre.length > 30) {
      nombre = nombre.substring(0, 27) + '...'
    }
    doc.text(nombre, marginLeft + 5, yPos)
    
    // Categoría
    doc.setTextColor(...textGray)
    let categoria = product.category || '-'
    if (categoria.length > 20) {
      categoria = categoria.substring(0, 17) + '...'
    }
    doc.text(categoria, marginLeft + 70, yPos)
    
    // Cantidad
    doc.setTextColor(...textDark)
    const cantidad = product.quantityDisplay || `${product.quantity}`
    doc.text(cantidad.toString(), marginLeft + 115, yPos)
    
    // Precio unitario
    doc.text(`$${product.price.toFixed(2)}`, marginLeft + 135, yPos)
    
    // Subtotal
    const subtotal = product.quantity * product.price
    doc.text(`$${subtotal.toFixed(2)}`, marginLeft + 160, yPos)
    
    yPos += 8
    
    // Nueva página si se llena
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
  })
  
  // ============================================
  // TOTAL
  // ============================================
  
  yPos += 5
  doc.line(marginLeft, yPos, marginLeft + pageWidth, yPos)
  yPos += 10
  
  // Fondo para el total
  doc.setFillColor(...primaryColor)
  doc.roundedRect(marginLeft + 100, yPos - 5, 80, 18, 2, 2, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', marginLeft + 110, yPos + 5)
  doc.text(`$${total.toFixed(2)}`, marginLeft + 175, yPos + 5, { align: 'right' })
  
  // ============================================
  // FOOTER
  // ============================================
  
  const pageHeight = doc.internal.pageSize.height
  doc.setFillColor(243, 243, 251)
  doc.rect(0, pageHeight - 20, 210, 20, 'F')
  
  doc.setTextColor(...textGray)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Generado con noteMarket - Tu asistente de compras inteligente', 105, pageHeight - 10, { align: 'center' })
  
  // ============================================
  // GUARDAR PDF
  // ============================================
  
  // Agregar número de página
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...textGray)
    doc.text(`Página ${i} de ${pageCount}`, 105, pageHeight - 5, { align: 'center' })
  }
  
  // Guardar archivo
  doc.save(`${filename}-${Date.now()}.pdf`)
  
  return true
}

/**
 * Genera un resumen corto en texto para copiar
 * @param {Array} products 
 * @param {number} total 
 */
export const generateTextSummary = (products, total) => {
  let text = '🛒 *noteMarket - Lista de Compras*\n\n'
  
  products.forEach((product, i) => {
    const subtotal = (product.quantity * product.price).toFixed(2)
    const cantidad = product.quantityDisplay || `${product.quantity} ud(s)`
    text += `${i + 1}. *${product.name}*\n`
    text += `   ${cantidad} x $${product.price.toFixed(2)} = $${subtotal}\n`
    text += `   Categoría: ${product.category}\n\n`
  })
  
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  text += `*TOTAL: $${total.toFixed(2)}*\n`
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  text += `(${products.length} productos)`
  
  return text
}
