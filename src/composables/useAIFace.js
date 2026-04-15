import { ref, onUnmounted } from 'vue'

export function useAIFace() {
  const isRunning = ref(false)
  const hasFace = ref(true)  // AI face is always "present"
  const facePosition = ref({ x: 0.5, y: 0.5 })
  const faceRotation = ref({ x: 0, y: 0 })
  const eyeOpenness = ref(1)
  const lookTarget = ref({ x: 0.5, y: 0.5 })  // Where AI is looking
  const mouthGlow = ref(false)
  const scanning = ref(true)

  let smoothPos = { x: 0.5, y: 0.5 }
  let smoothRotation = { x: 0, y: 0 }
  let blinkTimer = null
  let isBlinking = false
  let lookTimer = null
  let idleTimer = null
  let animFrame = null

  // State machine for AI behavior
  let currentBehavior = 'idle' // idle, scanning, alert, curious
  let behaviorTimer = null

  function start() {
    if (isRunning.value) return
    isRunning.value = true

    startIdleBehavior()
    startBlinkTimer()
    startLookAround()
    startAnimLoop()
  }

  function startIdleBehavior() {
    const behaviors = ['idle', 'scanning', 'curious', 'idle', 'scanning', 'curious']
    const nextBehavior = () => {
      if (!isRunning.value) return
      currentBehavior = behaviors[Math.floor(Math.random() * behaviors.length)]
      const duration = 3000 + Math.random() * 5000
      behaviorTimer = setTimeout(nextBehavior, duration)
    }
    behaviorTimer = setTimeout(nextBehavior, 2000)
  }

  function startBlinkTimer() {
    const doBlink = () => {
      if (!isRunning.value) return
      isBlinking = true
      setTimeout(() => {
        isBlinking = false
        eyeOpenness.value = 1
        blinkTimer = setTimeout(doBlink, 1500 + Math.random() * 4500)
      }, 120)
    }
    blinkTimer = setTimeout(doBlink, 2000 + Math.random() * 3000)
  }

  function startLookAround() {
    const look = () => {
      if (!isRunning.value) return

      const behavior = currentBehavior

      if (behavior === 'alert') {
        // Quick scanning movements
        lookTarget.value = {
          x: 0.2 + Math.random() * 0.6,
          y: 0.3 + Math.random() * 0.4
        }
      } else if (behavior === 'curious') {
        // Slower, more deliberate looking
        lookTarget.value = {
          x: 0.3 + Math.random() * 0.4,
          y: 0.35 + Math.random() * 0.3
        }
      } else {
        // Random gaze positions
        lookTarget.value = {
          x: 0.35 + Math.random() * 0.3,
          y: 0.4 + Math.random() * 0.2
        }
      }

      const delay = behavior === 'alert' ? 300 : behavior === 'curious' ? 800 : 1500
      lookTimer = setTimeout(look, delay + Math.random() * 500)
    }
    lookTimer = setTimeout(look, 1000)
  }

  function startAnimLoop() {
    const tick = () => {
      if (!isRunning.value) return

      // Smooth interpolation toward look target
      const tx = lookTarget.value.x
      const ty = lookTarget.value.y
      smoothPos.x += (tx - smoothPos.x) * 0.04
      smoothPos.y += (ty - smoothPos.y) * 0.04

      // Face rotation based on look direction
      const targetRotY = (smoothPos.x - 0.5) * 0.3
      const targetRotX = (smoothPos.y - 0.5) * 0.2
      smoothRotation.x += (targetRotX - smoothRotation.x) * 0.08
      smoothRotation.y += (targetRotY - smoothRotation.y) * 0.08

      facePosition.value = { x: smoothPos.x, y: smoothPos.y }
      faceRotation.value = { x: smoothRotation.x, y: smoothRotation.y }

      // Eye openness for blinks
      if (isBlinking) {
        eyeOpenness.value = 0
      } else {
        eyeOpenness.value += (1 - eyeOpenness.value) * 0.2
      }

      // Mouth glow for speaking
      if (Math.random() > 0.98) {
        mouthGlow.value = true
        setTimeout(() => { mouthGlow.value = false }, 200)
      }

      animFrame = requestAnimationFrame(tick)
    }
    animFrame = requestAnimationFrame(tick)
  }

  function stop() {
    isRunning.value = false
    if (blinkTimer) clearTimeout(blinkTimer)
    if (lookTimer) clearTimeout(lookTimer)
    if (behaviorTimer) clearTimeout(behaviorTimer)
    if (animFrame) cancelAnimationFrame(animFrame)
    blinkTimer = null
    lookTimer = null
    behaviorTimer = null
    animFrame = null
  }

  onUnmounted(stop)

  return {
    isRunning,
    hasFace,
    facePosition,
    faceRotation,
    eyeOpenness,
    lookTarget,
    mouthGlow,
    scanning,
    start,
    stop
  }
}