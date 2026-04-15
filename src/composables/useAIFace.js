import { ref, onUnmounted } from 'vue'

export function useAIFace(videoRef, onFaceDetected) {
  const isRunning = ref(false)
  const hasFace = ref(false)
  const facePosition = ref({ x: 0.5, y: 0.5 })
  const faceRotation = ref({ x: 0, y: 0 })
  const expression = ref('neutral')
  const errorMessage = ref('')
  const confidence = ref(0)
  const eyeOpenness = ref(1)
  
  let detector = null
  let stream = null
  let animationId = null
  let smoothPos = { x: 0.5, y: 0.5 }
  let smoothRotation = { x: 0, y: 0 }
  let blinkTimer = 0
  let isBlinking = false

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

  async function loadTF() {
    if (window.tf && window.faceDetection) return

    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js'),
      loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection@1.0.2/dist/face-detection.min.js')
    ])

    // Wait for globals
    const start = Date.now()
    await new Promise((resolve, reject) => {
      const check = () => {
        if (window.tf && window.faceDetection) resolve()
        else if (Date.now() - start > 20000) reject(new Error('TF load timeout'))
        else setTimeout(check, 100)
      }
      check()
    })
  }

  async function start() {
    if (stream) return

    try {
      await loadTF()

      if (!window.tf || !window.faceDetection) {
        errorMessage.value = 'Failed to load face detection. Please refresh.'
        return
      }

      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      })

      videoRef.value.srcObject = stream
      await videoRef.value.play()

      // Create face detector
      const model = window.faceDetection.SupportedModels.MediaPipeFaceDetector
      detector = await window.faceDetection.createDetector(model, {
        runtime: 'tfjs',
        maxFaces: 1
      })

      processFrame()
      startBlinkTimer()

      isRunning.value = true
      errorMessage.value = ''
    } catch (err) {
      console.error('AIFace error:', err)
      if (err.name === 'NotAllowedError') {
        errorMessage.value = 'Camera permission denied.'
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
        blinkTimer = setTimeout(doBlink, 2000 + Math.random() * 4000)
      }, 150)
    }
    blinkTimer = setTimeout(doBlink, 2000 + Math.random() * 3000)
  }

  async function processFrame() {
    if (!videoRef.value || !detector) return

    if (videoRef.value.readyState >= 2) {
      try {
        const faces = await detector.detect(videoRef.value)
        onFaceResults(faces)
      } catch (e) {
        // Skip frame silently
      }
    }

    animationId = requestAnimationFrame(processFrame)
  }

  function onFaceResults(faces) {
    if (!faces || faces.length === 0) {
      hasFace.value = false
      eyeOpenness.value = 1
      onFaceDetected?.({
        hasFace: false,
        position: smoothPos,
        rotation: smoothRotation,
        expression: expression.value,
        eyeOpenness: 1,
        lookDirection: { x: smoothRotation.y * 0.3, y: smoothRotation.x * 0.3 },
        confidence: 0
      })
      return
    }

    const face = faces[0]
    const box = face.box
    const vw = videoRef.value.videoWidth || 640
    const vh = videoRef.value.videoHeight || 480

    const centerX = (box.xMin + box.width / 2) / vw
    const centerY = (box.yMin + box.height / 2) / vh
    const mx = 1 - centerX

    smoothPos.x += (mx - smoothPos.x) * 0.08
    smoothPos.y += (centerY - smoothPos.y) * 0.08

    const targetRotY = (smoothPos.x - 0.5) * 0.4
    const targetRotX = (smoothPos.y - 0.5) * 0.3
    smoothRotation.x += (targetRotX - smoothRotation.x) * 0.1
    smoothRotation.y += (targetRotY - smoothRotation.y) * 0.1

    if (!isBlinking) {
      eyeOpenness.value += (1 - eyeOpenness.value) * 0.15
    } else {
      eyeOpenness.value = 0
    }

    confidence.value = face.keypoints ? 0.8 : 0.6

    hasFace.value = true
    facePosition.value = { x: smoothPos.x, y: smoothPos.y }
    faceRotation.value = { x: smoothRotation.x, y: smoothRotation.y }

    onFaceDetected?.({
      hasFace: true,
      position: facePosition.value,
      rotation: faceRotation.value,
      expression: expression.value,
      eyeOpenness: eyeOpenness.value,
      lookDirection: {
        x: smoothRotation.y * 0.5 + (Math.random() - 0.5) * 0.02,
        y: smoothRotation.x * 0.5 + (Math.random() - 0.5) * 0.02
      },
      confidence: confidence.value
    })
  }

  function stop() {
    if (blinkTimer) clearTimeout(blinkTimer)
    if (animationId) cancelAnimationFrame(animationId)
    if (stream) stream.getTracks().forEach(t => t.stop())
    if (videoRef.value) videoRef.value.srcObject = null
    detector = null
    stream = null
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