<template>
  <div class="container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Abrar Dhalwala</h1>
        <p class="hero-subtitle">Full‑Stack Engineer • AI Enthusiast • Creator</p>
        <div class="social-links">
          <a href="https://in.linkedin.com/in/abrardw" target="_blank" rel="noopener" class="social-link">
            LinkedIn
          </a>
          <a href="https://www.instagram.com/abrar.codes" target="_blank" rel="noopener" class="social-link">
            Instagram
          </a>
          <a href="https://www.threads.net/@abrar.codes" target="_blank" rel="noopener" class="social-link">
            Threads
          </a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="section about">
      <h2 class="section-title">About Me</h2>
      <p class="section-text">
        Hello! I’m Abrar, a senior frontend engineer specializing in Vue 3, real‑time computer‑vision and AI‑powered web experiences.
        I love crafting interactive, performance‑first interfaces that blend cutting‑edge tech with clean design.
      </p>
    </section>

    <!-- Projects Section -->
    <section class="section projects">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        <div class="project-card">
          <h3>Face Wireframe Demo</h3>
          <p class="project-description">
            Real‑time MediaPipe face‑mesh visualizer built with Vue 3 (this site).
          </p>
        </div>
        <div class="project-card">
          <h3>AI News Hub</h3>
          <p class="project-description">
            Aggregates latest AI news using custom APIs (referenced in my GitHub repo).
          </p>
        </div>
        <div class="project-card">
          <h3>OpenClaw Plugin Suite</h3>
          <p class="project-description">
            A collection of OpenClaw skills for automation and dev‑ops.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section contact">
      <h2 class="section-title">Contact</h2>
      <p class="section-text">
        Feel free to reach out via any of the social links above or drop me an email at
        <a href="mailto:abrardw@example.com" class="email-link">abrardw@example.com</a>.
      </p>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Abrar Dhalwala. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showMesh = ref(false); // kept for compatibility but not used
const showPoints = ref(false);
const fps = ref(0);
const status = ref('');

/* No face‑mesh logic needed for this redesign */
</script>

<style scoped>
/* Reset and base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #0a0a0a;
  color: #e0e0e0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
  padding: 4rem 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #00ffdd, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: #00ffdd;
  border-color: #00ffdd;
  background-color: rgba(0, 255, 221, 0.1);
}

/* Section Styles */
.section {
  padding: 4rem 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #00ffdd;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  width: 50px;
  height: 3px;
  background: #00ffdd;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.project-card {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 255, 221, 0.2);
}

.project-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #00ffdd;
}

.project-description {
  font-size: 1rem;
  opacity: 0.9;
}

/* Contact Section */
.email-link {
  color: #00ffdd;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.email-link:hover {
  text-decoration: none;
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.9rem;
  opacity: 0.6;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.8rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .section-title {
    font-size: 1.75rem;
  }
}
</style>