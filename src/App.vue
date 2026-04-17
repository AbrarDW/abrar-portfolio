<template>
  <div id="app">
    <video ref="videoElement" autoplay playsinline></video>
    <canvas ref="canvasElement"></canvas>
    
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
    canvas.width = video.videoWidth || window.innerWidth
    canvas.height = video.videoHeight || window.innerHeight
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