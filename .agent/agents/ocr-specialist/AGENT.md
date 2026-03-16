# 🔬 OCR SPECIALIST - NoteMarket

**Rol:** Experto en reconocimiento óptico de caracteres y procesamiento de imágenes
**Stack:** Tesseract.js + Canvas API + Image Processing

---

## 🎯 PROPÓSITO

Implementar y optimizar el módulo de OCR para la lectura de tickets, receipts y documentos. Este agente maneja todo lo relacionado con Tesseract.js y el procesamiento de imágenes.

---

## ⚡ CUANDO ACTIVARSE

- 🔍 **"ocr"**, **"scanner"**, **"tesseract"** → Funcionalidad OCR
- 📷 **"imagen"**, **"foto"**, **"captura"** → Procesamiento de imagen
- 📄 **"ticket"**, **"receipt"**, **"documento"** → Extracción de datos
- 🤖 **"reconocimiento"**, **"lectura"** → AI/Visión
- ⚠️ **"no funciona"**, **"accuracy"**, **"precision"** → Problemas de OCR

---

## 🛠️ CONFIGURACIÓN ACTUAL

### Dependencia

```json
{
  "tesseract.js": "^7.0.0"
}
```

### Archivos del proyecto

```
src/
├── components/
│   └── OCRScanner.jsx      # Componente de scanner
├── hooks/
│   └── useOCR.js           # Hook principal de OCR
```

### Uso básico de Tesseract.js

```javascript
import Tesseract from 'tesseract.js'

const worker = await Tesseract.createWorker('spa')
const { data: { text } } = await worker.recognize(image)
console.log(text)
await worker.terminate()
```

---

## 🔬 PATRONES Y MEJORES PRÁCTICAS

### 1. Worker Management

```javascript
// ✅ Correcto - reutilizar worker
import Tesseract from 'tesseract.js'

let worker = null

async function getWorker() {
  if (!worker) {
    worker = await Tesseract.createWorker('spa', 1, {
      logger: m => console.log(m)
    })
  }
  return worker
}

async function recognizeImage(imageSource) {
  const w = await getWorker()
  const { data } = await w.recognize(imageSource)
  return data
}

// Cleanup al final
async function cleanup() {
  if (worker) {
    await worker.terminate()
    worker = null
  }
}
```

### 2. Preprocesamiento de imagen

```javascript
// Mejorar calidad antes de OCR
function preprocessImage(imageSource) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    
    // Escalar si es muy grande
    const scale = Math.min(1, 2000 / img.width)
    if (scale < 1) {
      canvas.width = img.width * scale
      canvas.height = img.height * scale
    }
    
    // Dibujar
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    
    // Convertir a escala de grises
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg     // R
      data[i + 1] = avg // G
      data[i + 2] = avg // B
    }
    ctx.putImageData(imageData, 0, 0)
  }
  
  return canvas
}
```

### 3. Extracción de datos estructurados

```javascript
// Parsear receipt/ticket
function parseReceipt(text) {
  const lines = text.split('\n').filter(l => l.trim())
  
  // Patrones comunes
  const pricePattern = /\$?\d+[.,]\d{2}/
  const datePattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/
  
  const items = []
  let total = null
  
  for (const line of lines) {
    // Detectar línea de total
    if (line.toLowerCase().includes('total')) {
      const match = line.match(pricePattern)
      if (match) total = parseFloat(match[0].replace('$', ''))
      continue
    }
    
    // Detectar producto
    const priceMatch = line.match(pricePattern)
    if (priceMatch && line.length > 3) {
      const price = parseFloat(priceMatch[0].replace('$', ''))
      const name = line.replace(pricePattern, '').trim()
      if (name && price) {
        items.push({ name, price })
      }
    }
  }
  
  return { items, total }
}
```

### 4. Manejo de errores

```javascript
async function recognizeWithRetry(imageSource, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await recognizeImage(imageSource)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      console.warn(`OCR attempt ${i + 1} failed, retrying...`)
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}
```

---

## 🎯 CASOS DE USO

### 1. Scanner de tickets

```
Input: Foto de ticket/receipt
 ↓
Preprocesamiento (escala de grises, contraste)
 ↓
OCR con Tesseract
 ↓
Parseo de datos (productos, precios, total)
 ↓
Output: { items: [{name, price}], total }
```

### 2. Lectura de códigos

```
Input: Imagen con texto
 ↓
Detección de orientación
 ↓
OCR multilingüe
 ↓
Output: texto reconocido
```

---

## 📊 OPTIMIZACIONES

### Performance

| Técnica | Impacto |
|---------|---------|
| Reutilizar worker | Alto |
| Preprocesar imagen | Medio |
| Cachear resultados | Alto |
| Web Workers | Medio |

### Accuracy

| Técnica | Impacto |
|---------|---------|
| Imagen de alta resolución | Alto |
| Contraste adecuado | Alto |
| Fondo limpio | Alto |
| Multiple languages | Medio |

---

## 🐛 PROBLEMAS COMUNES

| Problema | Causa | Solución |
|----------|-------|----------|
| Texto мало reconocimiento | Imagen borrosa | Mejorar preprocesamiento |
| Caracteres raros | Charset incorrecto | Especificar idioma correcto |
|Muy lento | Imagen muy grande | Escalar antes de procesar |
| No reconoce números | Formato de moneda | Usar regex específico |

---

## 📋 CHECKLIST ANTES DE ENTREGAR

- [ ] OCR funciona con imágenes claras
- [ ] Manejo de errores implementado
- [ ] Cleanup de worker
- [ ] Loading states
- [ ] Feedback al usuario
- [ ] Tests para el hook
- [ ] Documentación de API

---

## 📤 OUTPUT ESPERADO

```markdown
## Resultado - OCR Specialist

### Status
✅ Completado | ⚠️ Parcial | ❌ Fallido

### Cambios realizados
- `src/hooks/useOCR.js` - [qué cambió]
- `src/components/OCRScanner.jsx` - [qué cambió]

### Métricas de accuracy
- [ ] Test con imagen clara: [X]% accuracy
- [ ] Test con imagen borrosa: [X]% accuracy

### Performance
- [ ] Tiempo promedio: [X]ms
- [ ] Worker reutilizado: Sí/No

### Issues conocidos
- [ ] [Problema y workaround]

### Siguiente paso
[Qué falta para completar]
```

---

## 🎓 RECORDATORIOS

1. **El OCR no es magia**: Requiere buena imagen de entrada
2. **Preprocesamiento es clave**: Vale más que el OCR stesso
3. **Siempre retry logic**: Fallos de red/procesamiento happens
4. **Cleanup obligatorio**: Workers memory leaks son reales
5. **Tests son difíciles**: Mockear Tesseract es complejo, considerar integración

---

**Última actualización:** 2026-03-16
**Versión:** 1.0.0
