<template>
  <div class="app">
    <!-- hidden video that feeds MediaPipe -->
    <video ref="videoEl" autoplay muted playsinline style="display:none;"></video>
    <!-- canvas covers full viewport -->
    <canvas ref="canvasEl" class="overlay"></canvas>

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

function onResults(results) {
  const canvas = canvasEl.value;
  const ctx = canvas.getContext('2d');
  canvas.width = videoEl.value.videoWidth;
  canvas.height = videoEl.value.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    if (showMesh.value) {
      drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { color: '#00ff88', lineWidth: 1 });
    }
    if (showPoints.value) {
      drawLandmarks(ctx, landmarks, { color: '#00ffff', lineWidth: 2, radius: 2 });
    }
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
  background: #000;
  overflow: hidden;
}
.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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
</style>