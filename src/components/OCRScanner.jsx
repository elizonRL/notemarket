import { useState, useRef } from 'react'
import { useOCR } from '@/hooks/useOCR'

const OCRScanner = ({ onScanComplete, onClose }) => {
  const [imagePreview, setImagePreview] = useState(null)
  const [scannedData, setScannedData] = useState(null)
  const [cameraMode, setCameraMode] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  const { processImage, isProcessing, progress, error } = useOCR()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraMode(true)
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('No se pudo acceder a la cámara. Por favor verifica los permisos.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraMode(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)
    
    const imageData = canvas.toDataURL('image/jpeg')
    setImagePreview(imageData)
    stopCamera()
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = async () => {
    if (!imagePreview) return

    const result = await processImage(imagePreview)
    
    if (result.success) {
      setScannedData(result)
    } else {
      alert('Error al procesar la imagen: ' + result.error)
    }
  }

  const handleConfirm = () => {
    if (scannedData) {
      onScanComplete({
        name: scannedData.name,
        price: scannedData.price,
        quantity: scannedData.quantity
      })
    }
    handleReset()
  }

  const handleReset = () => {
    setImagePreview(null)
    setScannedData(null)
    stopCamera()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            📷 Escanear Producto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {!imagePreview && !cameraMode && (
            <div className="space-y-3">
              <p className="text-gray-600 text-center">
                Selecciona una opción para escanear el producto
              </p>
              
              <button
                onClick={startCamera}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                📸 Usar Cámara
              </button>
              
              <div className="relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
                >
                  🖼️ Seleccionar de Galería
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {cameraMode && (
            <div className="space-y-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
              />
              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  📸 Capturar
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {imagePreview && !scannedData && (
            <div className="space-y-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full rounded-lg border-2 border-gray-200"
              />
              
              {isProcessing ? (
                <div className="text-center py-4">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-600">Procesando... {progress}%</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleScan}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    🔍 Escanear Texto
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-3 px-4 bg-gray-500 text-white rounded-lg font-medium"
                  >
                    ↩️
                  </button>
                </div>
              )}
            </div>
          )}

          {scannedData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-3">✅ Datos Extraídos</h4>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Nombre:</span>
                    <p className="font-medium">{scannedData.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-600 text-sm">Precio:</span>
                      <p className="font-medium">${scannedData.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Cantidad:</span>
                      <p className="font-medium">{scannedData.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  ✓ Confirmar
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-medium"
                >
                  Escanear Otra vez
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OCRScanner
