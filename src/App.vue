<template>
  <div class="app">
    <!-- hidden video feeding MediaPipe -->
    <video ref="videoEl" autoplay muted playsinline style="display:none;"></video>
    <!-- canvas covers full viewport -->
    <canvas ref="canvasEl" class="overlay"></canvas>

    <!-- Personal overlay -->
    <section class="info-panel">
      <h1 class="name">Abrar Dhalwala</h1>
      <p class="title">Full‑Stack Engineer • AI Enthusiast • Creator</p>
    </section>

    <!-- Terminal-like sidebar -->
    <aside class="terminal">
      <div class="terminal-header">
        <div
          v-for="(_, key) in Object.keys(sections.value)"
          :key="key"
          @click="selectedSection = key"
          :class="{ active: selectedSection === key }"
        >
          {{ key.charAt(0).toUpperCase() + key.slice(1) }}
        </div>
      </div>
      <div class="terminal-body">
        <div v-if="selectedSection" class="typing-text">{{ displayedText }}</div>
      </div>
    </aside>

    <!-- UI controls -->
    <div class="controls">
      <button v-if="!meshEnabled" @click="startMesh" class="control-btn">
        Enable Face Mesh
      </button>
      <template v-else>
        <button @click="showMesh = !showMesh" :class="{ active: showMesh }" class="control-btn">
          {{ showMesh ? 'Hide' : 'Show' }} Mesh
        </button>
        <button @click="showPoints = !showPoints" :class="{ active: showPoints }" class="control-btn">
          {{ showPoints ? 'Hide' : 'Show' }} Points
        </button>
      </template>
    </div>

    <div class="status">
      <div>FPS: {{ fps.toFixed(1) }}</div>
      <div>{{ status }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const videoEl = ref(null);
const canvasEl = ref(null);
const showMesh = ref(true);
const showPoints = ref(true);
const meshEnabled = ref(false);
const fps = ref(0);
const status = ref('Click "Enable Face Mesh" to start');

let faceMesh = null;
let camera = null;
let frameCount = 0;
let lastFpsUpdate = 0;

// Section data
const sections = ref({
  about: `Hello! I’m Abrar, a senior frontend engineer specializing in Vue 3, real‑time computer‑vision and AI‑powered web experiences. I love crafting interactive, performance‑first interfaces that blend cutting‑edge tech with clean design.`,
  experience: `- Senior Front‑End Engineer – 5+ years building Vue 3, React and real‑time web apps.\n- AI‑Driven UI Projects – Integrated MediaPipe, TensorFlow.js and custom ML models into interactive experiences.\n- OpenClaw Contributor – Developed automation plugins and skills for the OpenClaw ecosystem.`,
  contact: `Feel free to reach out via any of the social links above or drop me an email at abrardw@example.com.`,
  skills: `Vue 3, Vite, TypeScript, JavaScript, CSS‑in‑JS, Tailwind, MediaPipe, WebGL, Canvas API, Node.js, Git, CI/CD, Cloud Deployments.`
});

// UI state
const selectedSection = ref(null);
const displayedText = ref('');
const typingInterval = ref(null);
const typingSpeed = 40; // ms per char

// Simple heuristic to estimate expression (happy / sad / neutral)
function estimateExpression(landmarks) {
  const LEFT_MOUTH = 61;
  const RIGHT_MOUTH = 291;
  const UPPER_LIP_TOP = 13;
  const LOWER_LIP_BOTTOM = 14;

  const left = landmarks[LEFT_MOUTH];
  const right = landmarks[RIGHT_MOUTH];
  const upper = landmarks[UPPER_LIP_TOP];
  const lower = landmarks[LOWER_LIP_BOTTOM];

  const mouthWidth = Math.hypot(right.x - left.x, right.y - left.y);
  const mouthHeight = Math.hypot(lower.x - upper.x, lower.y - upper.y);

  const aspect = mouthHeight / mouthWidth;
  if (aspect > 0.35) return 'sad';
  if (aspect < 0.2) return 'happy';
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
      if (showMesh.value) {
        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { color: '#00ff88', lineWidth: 1 });
      }
      if (showPoints.value) {
        drawLandmarks(ctx, landmarks, { color: '#00ffff', lineWidth: 2, radius: 2 });
      }
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

function startMesh() {
  if (typeof FaceMesh === 'undefined' || typeof Camera === 'undefined') {
    status.value = 'MediaPipe scripts not loaded yet.';
    return;
  }
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });
  faceMesh.setOptions({
    maxNumFaces: 5,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  faceMesh.onResults(onResults);

  camera = new Camera(videoEl.value, {
    onFrame: async () => {
      await faceMesh.send({ image: videoEl.value });
    },
    width: 1280,
    height: 720
  });
  camera.start()
    .then(() => {
      status.value = 'Active';
      meshEnabled.value = true;
    })
    .catch((e) => {
      status.value = 'Camera error: ' + e.message;
    });
}

function startTyping(text) {
  displayedText.value = '';
  clearInterval(typingInterval.value);
  let i = 0;
  typingInterval.value = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text[i];
      i++;
    } else {
      clearInterval(typingInterval.value);
    }
  }, typingSpeed);
}

watch(selectedSection, (newVal) => {
  if (newVal) {
    startTyping(sections.value[newVal]);
  } else {
    displayedText.value = '';
    clearInterval(typingInterval.value);
  }
});

onMounted(() => {
  // Wait for MediaPipe scripts to load – we don't start the camera until user clicks.
  const wait = setInterval(() => {
    if (typeof FaceMesh !== 'undefined' && typeof Camera !== 'undefined') {
      clearInterval(wait);
      status.value = 'Scripts loaded – click "Enable Face Mesh" to start';
    }
  }, 100);
});

onBeforeUnmount(() => {
  if (camera) camera.stop();
});
</script>

<style scoped>
/* Base layout */
.app {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #0a0a2a, #000);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  color: #fff;
}

/* Video and canvas */
.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* allow clicks through to UI */
}

/* Personal overlay */
.info-panel {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #00ffdd;
  z-index: 10;
  animation: fadeIn 2s ease-out;
}
.info-panel .name {
  font-size: 2.8rem;
  margin-bottom: .4rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ffdd;
}
.info-panel .title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Terminal sidebar */
.terminal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 340px;
  background: rgba(0, 0, 0, 0.85);
  color: #0f0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  overflow: hidden;
  z-index: 10;
  border-left: 1px solid #0f0;
  box-shadow: -4px 0 8px rgba(0,0,0,0.6);
}
.terminal-header {
  display: flex;
  border-bottom: 1px solid #0f0;
  padding: 4px 0;
  background: #000;
}
.terminal-header div {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 6px 0;
  transition: background 0.2s, color 0.2s;
}
.terminal-header div.active {
  background: #0f0;
  color: #000;
}
.terminal-header div:hover:not(.active) {
  background: rgba(0,255,0,0.2);
  color: #0f0;
}
.terminal-body {
  position: absolute;
  top: 48px; /* header height */
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  overflow-y: auto;
}
.typing-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  /* subtle cursor */
  animation: blink 1s infinite;
}
@keyframes blink {
  50% { border-color: transparent; }
}
.typing-text::after {
  content: '|';
  display: inline-block;
  width: 1px;
}

/* Controls */
.controls {
  position: absolute;
  bottom: 20px;
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
button.active {
  background: rgba(0,123,255,0.5);
  border-color:#007bff;
}
button:hover {
  background: rgba(255,255,255,0.1);
}

/* Status */
.status {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}

/* Fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>