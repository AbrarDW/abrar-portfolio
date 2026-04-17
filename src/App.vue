<template>
  <div class="app">
    <!-- hidden video that feeds MediaPipe -->
    <video ref="videoEl" autoplay muted playsinline style="display:none;"></video>
    <!-- canvas covers full viewport -->
    <canvas ref="canvasEl" class="overlay"></canvas>

    <!-- Personal overlay (futuristic) -->
    <div class="info-panel">
      <h1 class="name">Abrar Dhalwala</h1>
      <div class="links">
        <a href="https://in.linkedin.com/in/abrardw" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://www.instagram.com/abrar.codes" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.threads.net/@abrar.codes" target="_blank" rel="noopener">Threads</a>
      </div>
    </div>

    <!-- UI controls -->
    <div class="controls">
      <button @click="showMesh = !showMesh" :class="{ active: showMesh }">
        {{ showMesh ? 'Hide' : 'Show' }} Mesh
      </button>
      <button @click="showPoints = !showPoints" :class="{ active: showPoints }">
        {{ showPoints ? 'Hide' : 'Show' }} Points
      </button>
    </div>

    <div class="status">
      <div>FPS: {{ fps.toFixed(1) }}</div>
      <div>{{ status }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const videoEl = ref(null);
const canvasEl = ref(null);
const showMesh = ref(true);
const showPoints = ref(true);
const fps = ref(0);
const status = ref('Initializing...');

let faceMesh = null;
let camera = null;
let frameCount = 0;
let lastFpsUpdate = 0;

// Simple heuristic to estimate expression (happy / sad / neutral)
function estimateExpression(landmarks) {
  // Mouth indices from MediaPipe FaceMesh
  const LEFT_MOUTH = 61;   // left corner
  const RIGHT_MOUTH = 291; // right corner
  const UPPER_LIP_TOP = 13; // upper lip center
  const LOWER_LIP_BOTTOM = 14; // lower lip center

  const left = landmarks[LEFT_MOUTH];
  const right = landmarks[RIGHT_MOUTH];
  const upper = landmarks[UPPER_LIP_TOP];
  const lower = landmarks[LOWER_LIP_BOTTOM];

  const mouthWidth = Math.hypot(right.x - left.x, right.y - left.y);
  const mouthHeight = Math.hypot(lower.x - upper.x, lower.y - upper.y);

  const aspect = mouthHeight / mouthWidth;
  // Heuristic thresholds (may need tuning)
  if (aspect > 0.35) {
    return 'sad';
  } else if (aspect < 0.2) {
    return 'happy';
  }
  return 'neutral';
}

function onResults(results) {
  const canvas = canvasEl.value;
  const ctx = canvas.getContext('2d');
  canvas.width = videoEl.value.videoWidth;
  canvas.height = videoEl.value.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    results.multiFaceLandmarks.forEach((landmarks, idx) => {
      // Draw mesh (wireframe) for each face
      if (showMesh.value) {
        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { color: '#00ff88', lineWidth: 1 });
      }
      // Draw points for each face
      if (showPoints.value) {
        drawLandmarks(ctx, landmarks, { color: '#00ffff', lineWidth: 2, radius: 2 });
      }
      // Write expression label near the nose tip (landmark 1)
      const nose = landmarks[1];
      const expr = estimateExpression(landmarks);
      ctx.fillStyle = '#ffdd00';
      ctx.font = '14px sans-serif';
      ctx.fillText(`#${idx + 1}: ${expr}`, nose.x * canvas.width, nose.y * canvas.height - 10);
    });
  }

  // FPS calc
  frameCount++;
  const now = performance.now();
  if (now - lastFpsUpdate >= 1000) {
    fps.value = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
  }
}

onMounted(() => {
  // Wait for MediaPipe globals
  const wait = setInterval(() => {
    if (typeof FaceMesh !== 'undefined' && typeof Camera !== 'undefined') {
      clearInterval(wait);
      // Init FaceMesh
      faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      faceMesh.onResults(onResults);

      // Set up camera
      camera = new Camera(videoEl.value, {
        onFrame: async () => {
          await faceMesh.send({ image: videoEl.value });
        },
        width: 1280,
        height: 720,
      });
      camera.start()
        .then(() => {
          status.value = 'Active';
        })
        .catch((e) => {
          status.value = 'Camera error: ' + e.message;
        });
    }
  }, 100);
});

onBeforeUnmount(() => {
  if (camera) camera.stop();
});
</script>

<style scoped>
.app {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #0a0a2a, #000);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, sans-serif;
}
.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
/* Personal overlay */
.info-panel {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #00ffdd;
  z-index: 10;
  animation: fadeIn 2s ease-out;
}
.info-panel .name {
  font-size: 3rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ffdd;
}
.info-panel .links a {
  margin: 0 0.8rem;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.3s, border-bottom 0.3s;
}
.info-panel .links a:hover {
  color: #00ffdd;
  border-bottom: 1px solid #00ffdd;
}
.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
}
button {
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: 1px solid #555;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
button.active { background: rgba(0,123,255,0.5); border-color:#007bff; }
.status {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>