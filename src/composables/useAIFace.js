import { ref, onUnmounted } from 'vue'

export function useAIFace(videoRef, onFaceDetected) {
  const isRunning = ref(false)
  const hasFace = ref(false)
  const facePosition = ref({ x: 0, y: 0 })
  const faceRotation = ref({ x: 0, y: 0 })
  const expression = ref('neutral')
  const errorMessage = ref('')
  const confidence = ref(0)
  
  let faceDetector = null
  let stream = null
  let animationId = null
  let lastFacePos = { x: 0.5, y: 0.5 }
  let smoothPos = { x: 0.5, y: 0.5 }
  let smoothRotation = { x: 0, y: 0 }
  let lookDirection = { x: 0, y: 0 }  // Where AI face is looking
  let blinkTimer = 0
  let isBlinking = false
  let eyeOpenness = 1

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async function loadFaceDetection() {
    if (window.FaceDetection) return

    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js')
    
    const start = Date.now()
    await new Promise((resolve, reject) => {
      const check = () => {
        if (window.FaceDetection) resolve()
        else if (Date.now() - start > 15000) reject(new Error('Face detection load timeout'))
        else setTimeout(check, 100)
      }
      check()
    })
  }

  async function start() {
    if (stream) return

    try {
      await loadFaceDetection()

      if (!window.FaceDetection) {
        errorMessage.value = 'Failed to load face detection. Please refresh.'
        return
      }

      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      })

      videoRef.value.srcObject = stream
      await videoRef.value.play()

      faceDetector = new window.FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
      })

      faceDetector.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5
      })

      faceDetector.onResults(onResults)

      processFrame()
      startBlinkTimer()

      isRunning.value = true
      errorMessage.value = ''
    } catch (err) {
      console.error('Face detection error:', err)
      if (err.name === 'NotAllowedError') {
        errorMessage.value = 'Camera permission denied. Please allow camera access.'
      } else if (err.name === 'NotFoundError') {
        errorMessage.value = 'No camera found.'
      } else {
        errorMessage.value = `Error: ${err.message}`
      }
    }
  }

  function startBlinkTimer() {
    const doBlink = () => {
      if (!isRunning.value) return
      isBlinking = true
      setTimeout(() => {
        isBlinking = false
        // Random next blink between 2-6 seconds
        blinkTimer = setTimeout(doBlink, 2000 + Math.random() * 4000)
      }, 150)
    }
    blinkTimer = setTimeout(doBlink, 2000 + Math.random() * 3000)
  }

  function processFrame() {
    if (!videoRef.value || !faceDetector) return

    if (videoRef.value.readyState >= 2) {
      faceDetector.send({ image: videoRef.value })
    }

    animationId = requestAnimationFrame(processFrame)
  }

  function onResults(results) {
    if (!results.detections || results.detections.length === 0) {
      hasFace.value = false
      lookDirection.x = smoothRotation.y * 0.3  // AI looks slightly where user was
      lookDirection.y = smoothRotation.x * 0.3
      onFaceDetected?.({ 
        hasFace: false, 
        position: smoothPos, 
        rotation: smoothRotation,
        expression: expression.value,
        eyeOpenness,
        lookDirection
      })
      return
    }

    const detection = results.detections[0]
    const box = detection.boundingBox
    const centerX = (box.xMin + box.width / 2) / videoRef.value.videoWidth
    const centerY = (box.yMin + box.height / 2) / videoRef.value.videoHeight

    // Mirror X (webcam)
    const mx = 1 - centerX

    // Smooth movement
    smoothPos.x += (mx - smoothPos.x) * 0.08
    smoothPos.y += (centerY - smoothPos.y) * 0.08

    // Calculate rotation from face position relative to center
    const targetRotY = (smoothPos.x - 0.5) * 0.4  // Left/right rotation
    const targetRotX = (smoothPos.y - 0.5) * 0.3  // Up/down rotation
    smoothRotation.x += (targetRotX - smoothRotation.x) * 0.1
    smoothRotation.y += (targetRotY - smoothRotation.y) * 0.1

    // Eye blink based on openness (if available from face mesh)
    if (!isBlinking) {
      eyeOpenness += (1 - eyeOpenness) * 0.1
    } else {
      eyeOpenness = 0
    }

    // Face confidence
    confidence.value = detection.score?.[0] ?? 0.8

    // AI face "looks" slightly away from user's actual position for natural feel
    lookDirection.x = smoothRotation.y * 0.5 + (Math.random() - 0.5) * 0.02
    lookDirection.y = smoothRotation.x * 0.5 + (Math.random() - 0.5) * 0.02

    hasFace.value = true
    facePosition.value = { x: smoothPos.x, y: smoothPos.y }
    faceRotation.value = { x: smoothRotation.x, y: smoothRotation.y }

    onFaceDetected?.({
      hasFace: true,
      position: facePosition.value,
      rotation: faceRotation.value,
      expression: expression.value,
      eyeOpenness,
      lookDirection,
      confidence: confidence.value
    })
  }

  function stop() {
    if (blinkTimer) clearTimeout(blinkTimer)
    if (animationId) cancelAnimationFrame(animationId)
    if (stream) stream.getTracks().forEach(t => t.stop())
    if (videoRef.value) videoRef.value.srcObject = null
    if (faceDetector) faceDetector.close()
    stream = null
    faceDetector = null
    isRunning.value = false
    hasFace.value = false
  }

  onUnmounted(stop)

  return {
    isRunning,
    hasFace,
    facePosition,
    faceRotation,
    expression,
    confidence,
    errorMessage,
    start,
    stop
  }
}