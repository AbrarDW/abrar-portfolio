import { ref, onUnmounted } from 'vue'

export function useHandTracking(videoRef, canvasRef, onGesture) {
  const isRunning = ref(false)
  const hasCamera = ref(false)
  const gestureState = ref('none')
  const handPosition = ref({ x: 0, y: 0 })
  const pinchDistance = ref(0)
  const scrollEnabled = ref(true)
  const errorMessage = ref('')
  
  let hands = null
  let stream = null
  let ctx = null
  let animationId = null

  // Gesture state tracking
  let lastPinchDist = 0
  let scrollAccumulator = 0
  let isPinching = false
  let lastY = 0

  // Load MediaPipe from CDN
  async function loadMediaPipe() {
    if (window.Hands && window.Camera) return

    const [handsUrl, cameraUrl] = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
    ]

    await Promise.all([
      loadScript(handsUrl),
      loadScript(cameraUrl)
    ])
  }

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

  async function start() {
    if (stream) return
    
    try {
      init()
      await loadMediaPipe()
      
      // Get webcam stream
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      })
      
      videoRef.value.srcObject = stream
      await videoRef.value.play()
      
      // Initialize MediaPipe Hands
      // eslint-disable-next-line no-undef
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      })
      
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5
      })
      
      hands.onResults(onResults)
      
      // Start processing frames
      processFrame()
      
      isRunning.value = true
      errorMessage.value = ''
    } catch (err) {
      console.error('Camera error:', err)
      if (err.name === 'NotAllowedError') {
        errorMessage.value = 'Camera permission denied. Please allow camera access.'
      } else if (err.name === 'NotFoundError') {
        errorMessage.value = 'No camera found. Please connect a webcam.'
      } else {
        errorMessage.value = `Camera error: ${err.message}`
      }
    }
  }

  function processFrame() {
    if (!videoRef.value || !hands) return
    
    if (videoRef.value.readyState >= 2) {
      hands.send({ image: videoRef.value })
    }
    
    animationId = requestAnimationFrame(processFrame)
  }

  function onResults(results) {
    if (!ctx || !canvasRef.value) return

    const w = videoRef.value.videoWidth || 640
    const h = videoRef.value.videoHeight || 480
    canvasRef.value.width = w
    canvasRef.value.height = h
    
    ctx.clearRect(0, 0, w, h)

    // Draw webcam feed (mirrored)
    if (results.image) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(results.image, -w, 0, w, h)
      ctx.restore()
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0]
      const connections = results.multiHandConnections || []
      
      // Draw hand skeleton (mirrored to match video)
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-w, 0)
      
      // Draw connections
      for (const connection of connections) {
        const start = landmarks[connection[0]]
        const end = landmarks[connection[1]]
        ctx.beginPath()
        ctx.strokeStyle = '#00f0ff66'
        ctx.lineWidth = 1.5
        ctx.moveTo(start.x * w, start.y * h)
        ctx.lineTo(end.x * w, end.y * h)
        ctx.stroke()
      }
      
      // Draw landmark dots
      for (const landmark of landmarks) {
        ctx.beginPath()
        ctx.arc(landmark.x * w, landmark.y * h, 2, 0, 2 * Math.PI)
        ctx.fillStyle = '#00f0ff'
        ctx.fill()
      }
      ctx.restore()

      // Get key landmarks
      const wrist = landmarks[0]
      const indexTip = landmarks[8]
      const thumbTip = landmarks[4]
      const middleTip = landmarks[12]
      const ringTip = landmarks[16]
      const pinkyTip = landmarks[20]
      const indexMcp = landmarks[5]
      const thumbMcp = landmarks[2]
      const middleMcp = landmarks[9]
      const ringMcp = landmarks[13]
      const pinkyMcp = landmarks[17]

      // Hand position (mirrored)
      const mx = 1 - wrist.x
      const my = wrist.y

      // Calculate pinch distance
      const pinchDist = Math.hypot(
        indexTip.x - thumbTip.x,
        indexTip.y - thumbTip.y
      )
      pinchDistance.value = pinchDist

      // Detect gestures
      const isIndexExtended = indexTip.y < indexMcp.y
      const isMiddleExtended = middleTip.y < middleMcp.y
      const isRingExtended = ringTip.y < ringMcp.y
      const isPinkyExtended = pinkyTip.y < pinkyMcp.y
      
      const allFingersExtended = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended
      const isPinch = pinchDist < 0.07
      const isOk = isPinch && isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended

      // Scroll gesture - hand moving up/down
      const scrollDelta = my - lastY
      if (Math.abs(scrollDelta) > 0.008 && scrollEnabled.value) {
        scrollAccumulator += scrollDelta
        if (Math.abs(scrollAccumulator) > 0.04) {
          onGesture?.(scrollAccumulator > 0 ? 'scroll-down' : 'scroll-up', handPosition.value)
          scrollAccumulator = 0
        }
      } else {
        scrollAccumulator = 0
      }
      lastY = my

      // Pinch zoom
      if (isPinching && lastPinchDist > 0) {
        const delta = pinchDist - lastPinchDist
        if (Math.abs(delta) > 0.008) {
          onGesture?.('pinch', { scale: delta > 0 ? 'in' : 'out' })
        }
      }

      // Gesture state transitions
      if (isPinch && !isPinching) {
        isPinching = true
        onGesture?.('pinch-start', { x: mx, y: my })
        gestureState.value = 'pinching'
      } else if (!isPinch && isPinching) {
        isPinching = false
        onGesture?.('pinch-end', { x: mx, y: my })
        gestureState.value = 'none'
      }

      // Open palm
      if (allFingersExtended && !isPinching && !isOk) {
        gestureState.value = 'open-palm'
        onGesture?.('open-palm', { x: mx, y: my })
      }

      // Pointing
      if (isIndexExtended && !allFingersExtended && !isPinching && !isOk) {
        gestureState.value = 'pointing'
        onGesture?.('point', { x: mx, y: my })
      }

      // OK sign
      if (isOk) {
        gestureState.value = 'ok'
        onGesture?.('ok', { x: mx, y: my })
      }

      lastPinchDist = pinchDist
      handPosition.value = { x: mx, y: my }
      hasCamera.value = true
    } else {
      gestureState.value = 'none'
      hasCamera.value = false
      isPinching = false
      lastPinchDist = 0
    }

    isRunning.value = true
  }

  function init() {
    if (!videoRef.value || !canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      stream = null
    }
    
    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
    
    if (hands) {
      hands.close()
      hands = null
    }
    
    isRunning.value = false
    hasCamera.value = false
  }

  onUnmounted(stop)

  return {
    isRunning,
    hasCamera,
    gestureState,
    handPosition,
    pinchDistance,
    scrollEnabled,
    errorMessage,
    start,
    stop
  }
}
