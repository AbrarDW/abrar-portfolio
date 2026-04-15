<template>
  <div class="ai-face-container" :class="{ active: isRunning }">
    <!-- AI Face SVG -->
    <svg
      ref="svgRef"
      viewBox="0 0 400 400"
      class="ai-face-svg"
      :style="faceStyle"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="inner-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="eye-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="60%" stop-color="#0088ff" />
          <stop offset="100%" stop-color="#0044aa" />
        </radialGradient>
        <radialGradient id="iris-gradient" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#0066cc" />
        </radialGradient>
        <linearGradient id="face-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a1520" />
          <stop offset="50%" stop-color="#051525" />
          <stop offset="100%" stop-color="#020810" />
        </linearGradient>
      </defs>

      <!-- Background pulse rings -->
      <circle v-for="i in 3" :key="'ring-'+i"
        cx="200" cy="200" :r="160 + i * 20"
        fill="none" :stroke="'rgba(0, 240, 255, ' + (0.08 - i * 0.02) + ')'"
        stroke-width="1" class="pulse-ring" :style="{ animationDelay: i * 0.8 + 's' }" />

      <!-- Face plate outer -->
      <ellipse cx="200" cy="200" rx="145" ry="160"
        fill="url(#face-gradient)" stroke="#00f0ff" stroke-width="1.5"
        stroke-opacity="0.6" filter="url(#glow)" />

      <!-- Face plate inner detail -->
      <ellipse cx="200" cy="200" rx="130" ry="145"
        fill="none" stroke="#00f0ff" stroke-width="0.5"
        stroke-opacity="0.2" stroke-dasharray="4 8" />

      <!-- Forehead arcs -->
      <path d="M 100 140 Q 200 100 300 140" fill="none" stroke="#00f0ff" stroke-width="1" stroke-opacity="0.3" stroke-linecap="round" />
      <path d="M 120 130 Q 200 95 280 130" fill="none" stroke="#00f0ff" stroke-width="0.5" stroke-opacity="0.2" stroke-linecap="round" />

      <!-- Left Eye -->
      <g :transform="`translate(${leftEyeOffset})`">
        <ellipse cx="140" cy="190" rx="38" ry="30" fill="#030d18" stroke="#00f0ff" stroke-width="0.8" stroke-opacity="0.4" />
        <ellipse cx="140" cy="190" rx="22" ry="22" fill="url(#eye-gradient)" filter="url(#inner-glow)" :style="{ transform: `rotate(${eyeRotation}deg)`, transformOrigin: '140px 190px' }" />
        <ellipse cx="140" cy="190" rx="12" ry="12" fill="url(#iris-gradient)" :style="{ transform: `translate(${pupilOffset.x * 4}px, ${pupilOffset.y * 3}px) rotate(${eyeRotation}deg)`, transformOrigin: '140px 190px' }" />
        <circle cx="140" cy="190" r="5" fill="#020810" :style="{ transform: `translate(${pupilOffset.x * 5}px, ${pupilOffset.y * 4}px)`, transformOrigin: '140px 190px' }" />
        <circle cx="134" cy="184" r="3" fill="rgba(255,255,255,0.6)" :style="{ opacity: eyeOpenness }" />
        <circle cx="146" cy="194" r="1.5" fill="rgba(255,255,255,0.3)" :style="{ opacity: eyeOpenness }" />
        <!-- Blink lid -->
        <ellipse v-if="eyeOpenness < 0.3" cx="140" cy="190" rx="38" ry="30" fill="#030d18" :style="{ clipPath: `inset(${100 - eyeOpenness * 200}% 0 0 0)` }" />
      </g>

      <!-- Right Eye -->
      <g :transform="`translate(${rightEyeOffset})`">
        <ellipse cx="260" cy="190" rx="38" ry="30" fill="#030d18" stroke="#00f0ff" stroke-width="0.8" stroke-opacity="0.4" />
        <ellipse cx="260" cy="190" rx="22" ry="22" fill="url(#eye-gradient)" filter="url(#inner-glow)" :style="{ transform: `rotate(${eyeRotation}deg)`, transformOrigin: '260px 190px' }" />
        <ellipse cx="260" cy="190" rx="12" ry="12" fill="url(#iris-gradient)" :style="{ transform: `translate(${pupilOffset.x * 4}px, ${pupilOffset.y * 3}px) rotate(${eyeRotation}deg)`, transformOrigin: '260px 190px' }" />
        <circle cx="260" cy="190" r="5" fill="#020810" :style="{ transform: `translate(${pupilOffset.x * 5}px, ${pupilOffset.y * 4}px)`, transformOrigin: '260px 190px' }" />
        <circle cx="254" cy="184" r="3" fill="rgba(255,255,255,0.6)" :style="{ opacity: eyeOpenness }" />
        <circle cx="266" cy="194" r="1.5" fill="rgba(255,255,255,0.3)" :style="{ opacity: eyeOpenness }" />
        <ellipse v-if="eyeOpenness < 0.3" cx="260" cy="190" rx="38" ry="30" fill="#030d18" :style="{ clipPath: `inset(${100 - eyeOpenness * 200}% 0 0 0)` }" />
      </g>

      <!-- Nasal bridge -->
      <path d="M 195 220 L 200 255 L 205 220" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-opacity="0.3" stroke-linecap="round" />

      <!-- Mouth -->
      <path d="M 165 280 Q 200 295 235 280" fill="none" :stroke="mouthGlow ? '#00f0ff' : '#00f0ff55'" stroke-width="2" stroke-linecap="round" />
      <path v-if="mouthGlow" d="M 165 280 Q 200 295 235 280" fill="none" stroke="#00f0ff" stroke-width="6" stroke-opacity="0.2" stroke-linecap="round" />

      <!-- Chin detail -->
      <path d="M 175 330 Q 200 340 225 330" fill="none" stroke="#00f0ff" stroke-width="0.5" stroke-opacity="0.2" stroke-linecap="round" />

      <!-- Circuit lines left -->
      <g opacity="0.4">
        <path d="M 65 160 L 80 160 L 85 170" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-linecap="round" />
        <path d="M 65 200 L 75 200 L 80 210" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-linecap="round" />
        <path d="M 65 240 L 78 240" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-linecap="round" />
        <circle cx="85" cy="170" r="2" fill="#00f0ff" />
        <circle cx="80" cy="210" r="2" fill="#00f0ff" />
        <circle cx="78" cy="240" r="2" fill="#00f0ff" />
      </g>

      <!-- Circuit lines right -->
      <g opacity="0.4">
        <path d="M 335 160 L 320 160 L 315 170" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-linecap="round" />
        <path d="M 335 200 L 325 200 L 320 210" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-linecap="round" />
        <path d="M 335 240 L 322 240" fill="none" stroke="#00f0ff" stroke-width="0.8" stroke-linecap="round" />
        <circle cx="315" cy="170" r="2" fill="#00f0ff" />
        <circle cx="320" cy="210" r="2" fill="#00f0ff" />
        <circle cx="322" cy="240" r="2" fill="#00f0ff" />
      </g>

      <!-- Scanning line -->
      <line v-if="scanning" x1="80" y1="0" x2="80" y2="400"
        stroke="#00f0ff" stroke-width="1" stroke-opacity="0.3" class="scan-line" />
    </svg>

    <!-- Status -->
    <div class="face-status" :class="{ active: isRunning }">
      <span class="status-dot" :class="{ active: isRunning }"></span>
      {{ isRunning ? 'AI ACTIVE' : 'AI FACE INACTIVE' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAIFace } from '../composables/useAIFace.js'

const props = defineProps({
  visible: { type: Boolean, default: true }
})

const svgRef = ref(null)
const eyeRotation = ref(0)
const pupilOffset = ref({ x: 0, y: 0 })
const leftEyeOffset = ref('0px 0px')
const rightEyeOffset = ref('0px 0px')

const ai = useAIFace()
const { isRunning, facePosition, faceRotation, eyeOpenness, mouthGlow, scanning, start, stop } = ai

const faceStyle = computed(() => {
  if (!isRunning.value) return { opacity: 0.3 }
  const rotX = faceRotation.value.x * 5
  const rotY = faceRotation.value.y * 5
  return {
    transform: `perspective(800px) rotateX(${-rotX}deg) rotateY(${rotY}deg)`,
    transition: 'transform 0.15s ease-out'
  }
})

// Update visual state from AI state
let unwatch = null
onMounted(() => {
  start()
  // Reactive updates via requestAnimationFrame polling
  const poll = () => {
    if (!isRunning.value) return
    eyeRotation.value = faceRotation.value.y * 0.3
    pupilOffset.value = {
      x: (facePosition.value.x - 0.5) * 2,
      y: (facePosition.value.y - 0.5) * 2
    }
    const eyeShiftX = faceRotation.value.y * 0.3
    const eyeShiftY = faceRotation.value.x * 0.2
    leftEyeOffset.value = `${eyeShiftX}px ${eyeShiftY}px`
    rightEyeOffset.value = `${eyeShiftX}px ${eyeShiftY}px`
    requestAnimationFrame(poll)
  }
  poll()
})

onUnmounted(stop)

defineExpose({ start, stop, isRunning })
</script>

<style scoped>
.ai-face-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-face-svg {
  width: 100%;
  max-width: 400px;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.3));
  transition: opacity 0.5s ease;
}

.ai-face-container:not(.active) .ai-face-svg {
  opacity: 0.3;
  filter: none;
}

.pulse-ring {
  animation: pulse-ring 3s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.02); }
}

.scan-line {
  animation: scan-move 3s linear infinite;
}

@keyframes scan-move {
  0% { transform: translateX(-60px); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { transform: translateX(60px); opacity: 0; }
}

.face-status {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: rgba(0, 240, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.face-status.active {
  color: rgba(0, 240, 255, 0.9);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 240, 255, 0.3);
}

.status-dot.active {
  background: #00f0ff;
  box-shadow: 0 0 8px #00f0ff;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 5px #00f0ff; }
  50% { box-shadow: 0 0 15px #00f0ff, 0 0 25px #00f0ff44; }
}
</style>