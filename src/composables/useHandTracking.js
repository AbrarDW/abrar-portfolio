import { ref, onUnmounted } from 'vue'
import { Hands, Results } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'
import { drawLandmarks, drawConnectors } from '@mediapipe/drawing_utils'

export function useHandTracking(videoRef, canvasRef, onGesture) {
  const isRunning = ref(false)
  const hasCamera = ref(false)
  const gestureState = ref('none')
  const handPosition = ref({ x: 0, y: 0 })
  const pinchDistance = ref(0)
  const scrollEnabled = ref(true)
  
  let hands = null
  let camera = null
  let ctx = null

  // Gesture state tracking
  let lastPinchDist = 0
  let scrollAccumulator = 0
  let isPinching = false
  let isScrolling = false

  function init() {
    if (!videoRef.value || !canvasRef.value) return

    ctx = canvasRef.value.getContext('2d')

    hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    })

    hands.onResults(onResults)

    camera = new Camera(videoRef.value, {
      onFrame: async () => {
        if (hands && videoRef.value) {
          await hands.send({ image: videoRef.value })
        }
      },
      width: 640,
      height: 480
    })
  }

  function onResults(results) {
    if (!ctx || !canvasRef.value) return

    canvasRef.value.width = videoRef.value.videoWidth || 640
    canvasRef.value.height = videoRef.value.videoHeight || 480
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    if (results.image) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-canvasRef.value.width, 0)
      ctx.drawImage(results.image, 0, 0, canvasRef.value.width, canvasRef.value.height)
      ctx.restore()
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0]
      
      // Draw hand skeleton
      drawLandmarks(ctx, landmarks, { color: '#00f0ff', lineWidth: 1, radius: 2 })
      drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, { color: '#00f0ff44', lineWidth: 1 })

      // Get key landmarks
      const wrist = landmarks[0]
      const indexTip = landmarks[8]
      const thumbTip = landmarks[4]
      const middleTip = landmarks[12]
      const ringTip = landmarks[16]
      const pinkyTip = landmarks[20]
      const indexMcp = landmarks[5]
      const thumbMcp = landmarks[2]

      // Mirror x coordinate (webcam is mirrored)
      const mx = 1 - wrist.x
      const my = wrist.y

      handPosition.value = { x: mx, y: my }

      // Calculate pinch distance (thumb + index)
      const pinchDist = Math.hypot(
        indexTip.x - thumbTip.x,
        indexTip.y - thumbTip.y
      )
      pinchDistance.value = pinchDist

      // Gesture detection
      const isIndexExtended = indexTip.y < indexMcp.y
      const isThumbExtended = thumbTip.x !== thumbMcp.x
      const allFingersExtended = 
        [indexTip, middleTip, ringTip, pinkyTip].every(tip => tip.y < [5, 9, 13, 17].map(i => landmarks[i]).find(mcp => true)?.y)
      const isPinch = pinchDist < 0.06
      const isOk = pinchDist < 0.06 && isIndexExtended

      // Scroll gesture (hand moving up/down)
      const scrollDelta = my - handPosition.value.y
      if (Math.abs(scrollDelta) > 0.01 && scrollEnabled.value) {
        scrollAccumulator += scrollDelta
        if (Math.abs(scrollAccumulator) > 0.05) {
          const direction = scrollAccumulator > 0 ? 'scroll-down' : 'scroll-up'
          onGesture?.(direction, handPosition.value)
          scrollAccumulator = 0
          isScrolling = true
        }
      } else {
        isScrolling = false
        scrollAccumulator = 0
      }

      // Pinch-to-zoom (change pinch distance)
      if (isPinching && lastPinchDist > 0) {
        const delta = pinchDist - lastPinchDist
        if (Math.abs(delta) > 0.01) {
          onGesture?.('pinch', { scale: delta > 0 ? 'in' : 'out' })
        }
      }

      // State transitions
      if (isPinch && !isPinching) {
        isPinching = true
        onGesture?.('pinch-start', { x: mx, y: my })
        gestureState.value = 'pinching'
      } else if (!isPinch && isPinching) {
        isPinching = false
        onGesture?.('pinch-end', { x: mx, y: my })
        gestureState.value = 'none'
      }

      // Open palm = show menu
      if (allFingersExtended && !isPinching) {
        gestureState.value = 'open-palm'
        onGesture?.('open-palm', { x: mx, y: my })
      }

      // Pointing = cursor/hover
      if (isIndexExtended && !allFingersExtended && !isPinching) {
        gestureState.value = 'pointing'
        onGesture?.('point', { x: mx, y: my })
      }

      // OK sign
      if (isOk) {
        gestureState.value = 'ok'
        onGesture?.('ok', { x: mx, y: my })
      }

      lastPinchDist = pinchDist
      hasCamera.value = true
    } else {
      gestureState.value = 'none'
      hasCamera.value = false
      isPinching = false
      lastPinchDist = 0
    }

    isRunning.value = true
  }

  async function start() {
    if (camera) return
    init()
    await camera.start()
  }

  function stop() {
    if (camera) {
      camera.stop()
      camera = null
    }
    if (hands) {
      hands.close()
      hands = null
    }
    isRunning.value = false
  }

  onUnmounted(stop)

  return {
    isRunning,
    hasCamera,
    gestureState,
    handPosition,
    pinchDistance,
    scrollEnabled,
    start,
    stop
  }
}
