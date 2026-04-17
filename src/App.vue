<template>
  <div id="app">
    <div class="video-container">
      <video ref="videoElement" autoplay playsinline></video>
      <canvas ref="canvasElement"></canvas>
    </div>
    
    <div class="controls">
      <button 
        class="control-btn" 
        :class="{ active: showMesh }"
        @click="toggleMesh"
      >
        {{ showMesh ? 'Hide Mesh' : 'Show Mesh' }}
      </button>
      <button 
        class="control-btn" 
        :class="{ active: showPoints }"
        @click="togglePoints"
      >
        {{ showPoints ? 'Hide Points' : 'Show Points' }}
      </button>
    </div>
    
    <div class="status">
      <div>FPS: {{ fps.toFixed(1) }}</div>
      <div>{{ status }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Refs
const videoElement = ref(null)
const canvasElement = ref(null)
const showMesh = ref(true)
const showPoints = ref(true)
const fps = ref(0)
const status = ref('Initializing...')

// MediaPipe variables
let faceMesh = null
let camera = null
let lastFrameTime = 0
let frameCount = 0
let lastFpsUpdate = 0

// Initialize MediaPipe Face Mesh
const initializeFaceMesh = () => {
  status.value = 'Loading Face Mesh...'
  
  faceMesh = new FaceMesh({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    }
  })

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  })

  faceMesh.onResults(onResults)

  // Initialize camera
  camera = new Camera(videoElement.value, {
    onFrame: async () => {
      await faceMesh.send({ image: videoElement.value })
    },
    width: 1280,
    height: 720
  })

  status.value = 'Starting camera...'
  camera.start().then(() => {
    status.value = 'Active'
    resizeCanvas()
  }).catch((error) => {
    status.value = 'Camera error: ' + error.message
  })
}

// Handle results from MediaPipe
const onResults = (results) => {
  const canvas = canvasElement.value
  const ctx = canvas.getContext('2d')
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0]
    
    // Draw mesh (wireframe)
    if (showMesh.value) {
      drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
        color: '#00ff88',
        lineWidth: 1
      })
    }
    
    // Draw landmarks (points)
    if (showPoints.value) {
      drawLandmarks(ctx, landmarks, {
        color: '#00ffff',
        lineWidth: 2,
        radius: 2
      })
    }
  }
  
  // Calculate FPS
  frameCount++
  const currentTime = performance.now()
  if (currentTime - lastFpsUpdate >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFpsUpdate = currentTime
  }
}

// Toggle mesh visibility
const toggleMesh = () => {
  showMesh.value = !showMesh.value
}

// Toggle points visibility
const togglePoints = () => {
  showPoints.value = !showPoints.value
}

// Resize canvas to match video
const resizeCanvas = () => {
  const canvas = canvasElement.value
  const video = videoElement.value
  
  if (canvas && video) {
    // Use the CSS dimensions we set (200px width, height auto)
    const rect = video.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }
}

// Handle window resize
const handleResize = () => {
  resizeCanvas()
}

// Lifecycle hooks
onMounted(() => {
  // Wait for MediaPipe scripts to load
  if (typeof FaceMesh !== 'undefined' && typeof Camera !== 'undefined') {
    initializeFaceMesh()
  } else {
    // Wait for scripts to load
    const checkInterval = setInterval(() => {
      if (typeof FaceMesh !== 'undefined' && typeof Camera !== 'undefined') {
        clearInterval(checkInterval)
        initializeFaceMesh()
      }
    }, 100)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (camera) {
    camera.stop()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

.video-container {
  position: relative;
  width: 200px; /* Small corner size */
  margin: 0;
}

#videoElement {
  width: 100%;
  height: auto;
  display: block;
  background-color: #000;
}

#canvasElement {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.controls {
  position: absolute;
  top: 20px;
  left: 230px; /* Right of video */
  z-index: 10;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.control-btn {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: 1px solid #333;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #555;
}

.control-btn.active {
  background: rgba(0, 123, 255, 0.5);
  border-color: #007bff;
}

.status {
  position: absolute;
  bottom: 20px;
  left: 230px; /* Align with controls */
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
}
</style>