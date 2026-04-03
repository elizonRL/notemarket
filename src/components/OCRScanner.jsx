import { useState, useRef, useEffect } from 'react'
import { useOCR } from '@/hooks/useOCR'
import { IconCamera, IconImage, IconSearch, IconClose, IconCheck } from './Icons'

const OCRScanner = ({ onScanComplete, onClose }) => {
  const [imagePreview, setImagePreview] = useState(null)
  const [scannedData, setScannedData] = useState(null)
  const [cameraMode, setCameraMode] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [scanError, setScanError] = useState(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  const { processImage, isProcessing, progress, error } = useOCR()

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Effect to detect video ready state with timeout
  useEffect(() => {
    if (!cameraMode) return

    // Give React a tick to render the video element
    const setupTimeout = setTimeout(() => {
      const video = videoRef.current
      if (!video || !streamRef.current) return

      // Timeout fallback - 3 seconds max to show video
      const timeoutId = setTimeout(() => {
        if (video.readyState >= 2) {
          video.play().catch(() => {})
          setIsVideoReady(true)
        }
      }, 3000)

      const handleLoadedMetadata = () => {
        clearTimeout(timeoutId)
        video.play().catch(() => {})
        setIsVideoReady(true)
      }

      const handleCanPlay = () => {
        clearTimeout(timeoutId)
        if (video.readyState >= 2) {
          video.play().catch(() => {})
          setIsVideoReady(true)
        }
      }

      // Check if already loaded
      if (video.readyState >= 2) {
        clearTimeout(timeoutId)
        video.play().catch(() => {})
        setIsVideoReady(true)
      } else {
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('canplay', handleCanPlay)
      }

      // Cleanup function
      return () => {
        clearTimeout(timeoutId)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('canplay', handleCanPlay)
      }
    }, 100)

    return () => clearTimeout(setupTimeout)
  }, [cameraMode])

  const startCamera = async () => {
    try {
      setCameraError(null)
      setIsVideoReady(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraMode(true)
    } catch (err) {
      console.error('Error accessing camera:', err)
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos o asegura que usas HTTPS.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraMode(false)
    setIsVideoReady(false)
    setCameraError(null)
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

    setScanError(null)
    console.log('[OCR] Iniciando procesamiento de imagen...')
    const result = await processImage(imagePreview)

    // DEBUG: Log de los datos recibidos
    console.log('[OCR] Resultado del OCR:', result)
    console.log('[OCR] Datos procesados:', {
      name: result.name,
      price: result.price,
      quantity: result.quantity,
      rawText: result.rawText?.substring(0, 100)
    })

    if (result.success) {
      setScannedData(result)
    } else {
      setScanError('Error al procesar la imagen: ' + result.error)
    }
  }

  const handleConfirm = () => {
    if (scannedData) {
      const dataToSend = {
        name: scannedData.name,
        price: scannedData.price,
        quantity: scannedData.quantity
      }
      console.log('[OCR] Enviando datos a FormSection:', dataToSend)
      onScanComplete(dataToSend)
    }
    handleReset()
  }

  const handleReset = () => {
    setImagePreview(null)
    setScannedData(null)
    setScanError(null)
    stopCamera()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>

        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h3 className='text-lg font-bold text-gray-800'>
            📷 Escanear Producto
          </h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 p-1'
          >
            <IconClose className='w-6 h-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-4 space-y-4'>

          {!imagePreview && !cameraMode && (
            <div className='space-y-3'>
              <p className='text-gray-600 text-center'>
                Selecciona una opción para escanear el producto
              </p>

              <button
                onClick={startCamera}
                className='w-full py-3 bg-gradient-to-r from-jacarta-500 to-jacarta-600 text-white rounded-xl font-medium hover:from-jacarta-600 hover:to-jacarta-700 transition-all flex items-center justify-center gap-2'
              >
                <IconCamera className='w-5 h-5' />
                Usar Camara
              </button>

              <div className='relative'>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='w-full py-3 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-xl font-medium hover:from-warm-600 hover:to-warm-700 transition-all flex items-center justify-center gap-2'
                >
                  <IconImage className='w-5 h-5' />
                  Seleccionar de Galeria
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileSelect}
                  className='hidden'
                />
              </div>
            </div>
          )}

          {cameraMode && (
            <div className='space-y-3'>
              {/* Video o estado de carga/error */}
              <div className='relative w-full rounded-lg overflow-hidden bg-black min-h-[240px] flex items-center justify-center'>
                {/* Loading overlay */}
                {!isVideoReady && !cameraError && (
                  <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10'>
                    <div className='animate-pulse mb-2 text-4xl'>📷</div>
                    <p className='text-white text-sm'>Iniciando cámara...</p>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className='w-full rounded-lg bg-black'
                />
                {cameraError && (
                  <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center'>
                    <p className='text-red-400 text-lg mb-2'>⚠️</p>
                    <p className='text-red-300 text-sm text-center px-4'>{cameraError}</p>
                  </div>
                )}
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={capturePhoto}
                  disabled={!isVideoReady}
                  className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    isVideoReady
                      ? 'bg-jacarta-600 text-white hover:bg-jacarta-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <IconCamera className='w-5 h-5' />
                  Capturar
                </button>
                <button
                  onClick={stopCamera}
                  className='flex-1 py-3 bg-gray-400 text-white rounded-xl font-medium hover:bg-gray-500'
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {imagePreview && !scannedData && (
            <div className='space-y-3'>
              <img
                src={imagePreview}
                alt='Preview'
                className='w-full rounded-lg border-2 border-gray-200'
              />

              {scanError && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <p className='text-red-700 text-sm'>{scanError}</p>
                </div>
              )}

              {isProcessing ? (
                <div className='text-center py-4'>
                  <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
                    <div
                      className='bg-blue-600 h-4 rounded-full transition-all'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className='text-gray-600'>Procesando... {progress}%</p>
                </div>
              ) : (
                <div className='flex gap-3'>
                  <button
                    onClick={handleScan}
                    className='flex-1 py-3 bg-jacarta-600 text-white rounded-xl font-medium hover:bg-jacarta-700 flex items-center justify-center gap-2'
                  >
                    <IconSearch className='w-5 h-5' />
                    Escanear Texto
                  </button>
                  <button
                    onClick={handleReset}
                    className='py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300'
                  >
                    <IconClose className='w-5 h-5' />
                  </button>
                </div>
              )}
            </div>
          )}

          {scannedData && (
            <div className='space-y-4'>
              <div className='bg-jacarta-50 border border-jacarta-200 rounded-xl p-4'>
                <h4 className='font-bold text-jacarta-800 mb-3 flex items-center gap-2'>
                  <IconCheck className='w-5 h-5' />
                  Datos Extraidos
                </h4>

                <div className='space-y-2'>
                  <div>
                    <span className='text-gray-600 text-sm'>Nombre:</span>
                    <p className='font-medium'>{scannedData.name}</p>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <span className='text-gray-600 text-sm'>Precio:</span>
                      <p className='font-medium'>${scannedData.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className='text-gray-600 text-sm'>Cantidad:</span>
                      <p className='font-medium'>{scannedData.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={handleConfirm}
                  className='flex-1 py-3 bg-jacarta-600 text-white rounded-xl font-medium hover:bg-jacarta-700 flex items-center justify-center gap-2'
                >
                  <IconCheck className='w-5 h-5' />
                  Confirmar
                </button>
                <button
                  onClick={handleReset}
                  className='flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300'
                >
                  Escanear Otra vez
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-red-700'>Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OCRScanner
