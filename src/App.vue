<template>
  <div class="app">
    <!-- hidden video feeding MediaPipe -->
    <video ref="videoEl" autoplay muted playsinline style="display:none;"></video>
    <canvas ref="canvasEl" class="overlay"></canvas>

    <!-- Futuristic Personal Overlay -->
    <section class="info-panel">
      <h1 class="name">Abrar Dhalwala</h1>
      <p class="title">Full‑Stack Engineer • AI Enthusiast • Creator</p>
      <div class="links">
        <a href="https://in.linkedin.com/in/abrardw" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://www.instagram.com/abrar.codes" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.threads.net/@abrar.codes" target="_blank" rel="noopener">Threads</a>
      </div>
    </section>

    <!-- Main content sections (scrollable) -->
    <section class="content">
      <article class="about">
        <h2>About Me</h2>
        <p>Hello! I’m Abrar, a senior frontend engineer specializing in Vue 3, real‑time computer‑vision and AI‑powered web experiences. I love crafting interactive, performance‑first interfaces that blend cutting‑edge tech with clean design.</p>
      </article>
      <article class="projects">
        <h2>Projects</h2>
        <ul>
          <li><strong>Face Wireframe Demo</strong> – Real‑time MediaPipe face‑mesh visualizer built with Vue 3 (this site).</li>
          <li><strong>AI News Hub</strong> – Aggregates latest AI news using custom APIs (referenced in my GitHub repo).</li>
          <li><strong>OpenClaw Plugin Suite</strong> – A collection of OpenClaw skills for automation and dev‑ops.</li>
        </ul>
      </article>
      <article class="contact">
        <h2>Contact</h2>
        <p>Feel free to reach out via any of the social links above or drop me an email at <a href="mailto:abrardw@example.com">abrardw@example.com</a>.</p>
      </article>
      <article class="experience">
        <h2>Experience</h2>
        <ul>
          <li><strong>Senior Front‑End Engineer</strong> – 5+ years building Vue 3, React and real‑time web apps.</li>
          <li><strong>AI‑Driven UI Projects</strong> – Integrated MediaPipe, TensorFlow.js and custom ML models into interactive experiences.</li>
          <li><strong>OpenClaw Contributor</strong> – Developed automation plugins and skills for the OpenClaw ecosystem.</li>
        </ul>
      </article>
      <article class="skills">
        <h2>Skills</h2>
        <p>Vue 3, Vite, TypeScript, JavaScript, CSS‑in‑JS, Tailwind, MediaPipe, WebGL, Canvas API, Node.js, Git, CI/CD, Cloud Deployments.</p>
      </article>
    </section>

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
  // Wait for MediaPipe scripts to load – we don't start the camera until user clicks.
  const wait = setInterval(() => {
    if (typeof FaceMesh !== 'undefined' && typeof Camera !== 'undefined') {
      clearInterval(wait);
      status.value = 'Scripts loaded – click \"Enable Face Mesh\" to start';
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
  color: #fff;
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
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #00ffdd;
  z-index: 10;
  animation: fadeIn 2s ease-out;
}
.info-panel .name { font-size: 3rem; margin-bottom: .5rem; letter-spacing: 2px; text-shadow: 0 0 10px #00ffdd; }
.info-panel .title { font-size: 1.2rem; margin-bottom: 1rem; }
.info-panel .links a { margin: 0 .6rem; color: #fff; text-decoration: none; border-bottom: 1px solid transparent; transition: color .3s, border-bottom .3s; }
.info-panel .links a:hover { color: #00ffdd; border-bottom: 1px solid #00ffdd; }
/* Scrollable content sections */
.content {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow-y: auto;
  padding: 4rem 2rem 2rem;
  z-index: 5;
}
.content article { max-width: 800px; margin: 2rem auto; background: rgba(0,0,0,0.6); padding: 1.5rem; border-radius: 8px; }
.content h2 { margin-top: 0; color: #00ffdd; }
.content p, .content li { line-height: 1.6; }
.controls { position: absolute; top: 20px; left: 20px; z-index: 10; display: flex; gap: 10px; }
button { background: rgba(0,0,0,0.6); color: #fff; border: 1px solid #555; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
button.active { background: rgba(0,123,255,0.5); border-color:#007bff; }
.status { position: absolute; bottom: 20px; left: 20px; z-index: 10; background: rgba(0,0,0,0.7); color: #fff; padding: 8px 12px; border-radius: 4px; font-size: 12px; }
@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(-20px);} to { opacity:1; transform:translateX(-50%) translateY(0);} }
</style>