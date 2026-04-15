<template>
  <div class="min-h-screen jarvis-bg text-white overflow-x-hidden">
    <!-- AI Face Background -->
    <div class="fixed inset-0 z-10 pointer-events-none">
      <AIFace ref="aiFaceRef" :visible="aiFaceEnabled" />
    </div>

    <!-- Scanline Overlay -->
    <div class="scanlines"></div>

    <!-- HUD Corner Decorations -->
    <div class="hud-corner top-8 left-8"></div>
    <div class="hud-corner top-8 right-8"></div>
    <div class="hud-corner bottom-8 left-8"></div>
    <div class="hud-corner bottom-8 right-8"></div>

    <!-- System Status Bar -->
    <header class="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-gradient-to-b from-[#020810] to-transparent">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="jarvis-font text-lg tracking-widest">
            <span class="text-cyan-400">◈</span> JARVIS <span class="text-cyan-400/50">//</span> PORTFOLIO
          </div>
        </div>
        <div class="flex items-center gap-6 mono-font text-xs text-cyan-400/60">
          <span v-if="aiFaceRef.value?.isRunning" class="text-emerald-400">
            <span class="animate-pulse">●</span> AI ACTIVE
          </span>
          <span>{{ systemTime }}</span>
          <button @click="toggleAIFace" class="ml-4 px-3 py-1 border border-cyan-400/30 rounded hover:border-cyan-400/60 transition-colors text-xs">
            {{ aiFaceRef.value?.isRunning ? 'DISABLE AI' : 'ENABLE AI' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Scroll Indicator -->
    <div class="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2">
      <div v-for="i in 5" :key="i" class="w-0.5 h-3 rounded-full transition-all duration-300"
           :class="activeSectionIndex >= i ? 'bg-cyan-400' : 'bg-cyan-400/20'"></div>
    </div>

    <!-- Main Content -->
    <main class="relative z-10">
      <!-- Hero Section -->
      <section id="hero" class="min-h-screen flex items-center relative">
        <div class="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]"></div>
        
        <div class="max-w-7xl mx-auto px-8 pt-24 w-full">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs mono-font mb-6">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SYSTEM ONLINE — v2.0
            </div>
            
            <div class="jarvis-font text-6xl md:text-8xl font-black tracking-tight mb-4">
              <span class="text-white">HELLO,</span>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400"> I AM</span>
            </div>
            
            <h1 class="jarvis-font text-6xl md:text-8xl font-black tracking-tight mb-6">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 glow-text">
                ABRAR
              </span>
            </h1>
            
            <div class="typewriter mono-font text-cyan-400/80 text-lg mb-8">
              <span>{{ typedText }}</span><span class="animate-pulse">|</span>
            </div>
            
            <p class="text-slate-400 text-lg max-w-xl leading-relaxed mb-10">
              Full-Stack Software Engineer specializing in building exceptional digital experiences. 
              Powered by precision code and creative problem-solving.
            </p>
            
            <div class="flex flex-wrap gap-4">
              <button @click="scrollToSection('contact')" class="jarvis-btn-primary">
                <span class="mono-font text-sm tracking-wider">INITIATE CONTACT</span>
              </button>
              <button @click="scrollToSection('skills')" class="jarvis-btn-secondary">
                <span class="mono-font text-sm tracking-wider">VIEW CAPABILITIES</span>
              </button>
            </div>

            <!-- Stats Row -->
            <div class="grid grid-cols-3 gap-6 mt-16 max-w-xl">
              <div v-for="stat in stats" :key="stat.label" class="text-center">
                <div class="jarvis-font text-3xl font-bold text-cyan-400">{{ stat.value }}</div>
                <div class="mono-font text-xs text-slate-500 mt-1">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="absolute bottom-12 right-12 hidden lg:block">
          <div class="relative w-32 h-32">
            <div class="absolute inset-0 border border-cyan-400/20 rounded-full animate-spin" style="animation-duration: 20s;"></div>
            <div class="absolute inset-4 border border-cyan-400/30 rounded-full animate-spin" style="animation-duration: 15s; animation-direction: reverse;"></div>
            <div class="absolute inset-8 border border-cyan-400/40 rounded-full animate-spin" style="animation-duration: 10s;"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-4xl">◈</span>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="min-h-screen py-24 relative">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent"></div>
        
        <div class="max-w-7xl mx-auto px-8 relative">
          <div class="flex items-center gap-4 mb-4">
            <span class="mono-font text-cyan-400 text-xs">02.</span>
            <h2 class="jarvis-font text-4xl font-bold text-white">ABOUT</h2>
          </div>
          <div class="h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent mb-12"></div>
          
          <div class="grid lg:grid-cols-2 gap-16">
            <div class="space-y-6 text-slate-300 leading-relaxed">
              <p>
                I'm a <span class="text-cyan-400">Senior Software Engineer</span> with over a decade of experience 
                transforming complex problems into elegant, scalable solutions. Based in the UAE, I work with 
                startups and established teams worldwide.
              </p>
              <p>
                My expertise spans the full development lifecycle — from architecting backend systems with 
                <span class="text-cyan-400">NestJS</span>, <span class="text-cyan-400">Laravel</span>, and 
                <span class="text-cyan-400">FastAPI</span>, to crafting intuitive interfaces with 
                <span class="text-cyan-400">Vue</span> and <span class="text-cyan-400">React</span>.
              </p>
              <p>
                I believe in clean architecture, test-driven development, and shipping code that not only 
                works but is maintainable for the long haul.
              </p>
            </div>
            
            <div class="space-y-6">
              <h3 class="jarvis-font text-lg text-white">CORE EXPERTISE</h3>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="skill in coreSkills" :key="skill.name" 
                     class="p-4 bg-white/5 border border-cyan-400/10 rounded-lg hover:border-cyan-400/30 transition-all group">
                  <div class="text-2xl mb-2">{{ skill.icon }}</div>
                  <div class="jarvis-font text-sm text-white">{{ skill.name }}</div>
                  <div class="mono-font text-xs text-slate-500 mt-1">{{ skill.detail }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience Section -->
      <section id="experience" class="min-h-screen py-24 relative">
        <div class="max-w-7xl mx-auto px-8">
          <div class="flex items-center gap-4 mb-4">
            <span class="mono-font text-cyan-400 text-xs">03.</span>
            <h2 class="jarvis-font text-4xl font-bold text-white">EXPERIENCE</h2>
          </div>
          <div class="h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent mb-12"></div>
          
          <div class="space-y-6">
            <div v-for="job in experience" :key="job.company" 
                 class="relative pl-8 border-l border-cyan-400/20 hover:border-cyan-400 transition-all group">
              <div class="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-cyan-400/50 group-hover:bg-cyan-400 transition-colors"></div>
              <div class="p-6 bg-white/5 border border-cyan-400/10 rounded-lg hover:border-cyan-400/30 transition-all">
                <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 class="jarvis-font text-xl text-white">{{ job.role }}</h3>
                    <p class="text-cyan-400 mono-font text-sm">{{ job.company }}</p>
                  </div>
                  <span class="mono-font text-xs text-slate-500 border border-slate-700 rounded px-2 py-1">
                    {{ job.period }}
                  </span>
                </div>
                <p class="text-slate-400 text-sm">{{ job.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="min-h-screen py-24 relative">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent"></div>
        
        <div class="max-w-7xl mx-auto px-8 relative">
          <div class="flex items-center gap-4 mb-4">
            <span class="mono-font text-cyan-400 text-xs">04.</span>
            <h2 class="jarvis-font text-4xl font-bold text-white">SKILLS</h2>
          </div>
          <div class="h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent mb-12"></div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="category in skillCategories" :key="category.name" 
                 class="p-6 bg-white/5 border border-cyan-400/10 rounded-lg hover:border-cyan-400/30 transition-all">
              <h3 class="mono-font text-xs text-cyan-400 tracking-widest mb-4">{{ category.name }}</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in category.items" :key="skill"
                      class="px-3 py-1.5 text-sm rounded border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300 transition-all cursor-default">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tech Stack Visualization -->
          <div class="mt-16">
            <h3 class="jarvis-font text-xl text-white mb-8 text-center">TECH STACK</h3>
            <div class="flex flex-wrap justify-center gap-4">
              <div v-for="tech in techStack" :key="tech.name"
                   class="flex items-center gap-3 px-4 py-2 bg-white/5 border border-cyan-400/10 rounded-full hover:border-cyan-400/40 transition-all group">
                <span class="text-xl">{{ tech.icon }}</span>
                <span class="mono-font text-sm text-slate-300 group-hover:text-white">{{ tech.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Education Section -->
      <section id="education" class="min-h-screen py-24 relative">
        <div class="max-w-7xl mx-auto px-8">
          <div class="flex items-center gap-4 mb-4">
            <span class="mono-font text-cyan-400 text-xs">05.</span>
            <h2 class="jarvis-font text-4xl font-bold text-white">EDUCATION</h2>
          </div>
          <div class="h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent mb-12"></div>
          
          <div class="max-w-2xl">
            <div class="p-8 bg-white/5 border border-cyan-400/10 rounded-lg hover:border-cyan-400/30 transition-all">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center jarvis-font text-2xl text-cyan-400">
                  M
                </div>
                <div class="flex-1">
                  <h3 class="jarvis-font text-xl text-white">M S University, Vadodara</h3>
                  <p class="text-cyan-400 mono-font text-sm mt-1">Diploma in Computer Engineering</p>
                  <p class="mono-font text-xs text-slate-500 mt-2">2010 — 2014</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="min-h-screen py-24 relative flex items-center">
        <div class="absolute inset-0 bg-gradient-to-t from-cyan-950/20 to-transparent"></div>
        
        <div class="max-w-7xl mx-auto px-8 relative w-full">
          <div class="flex items-center gap-4 mb-4">
            <span class="mono-font text-cyan-400 text-xs">06.</span>
            <h2 class="jarvis-font text-4xl font-bold text-white">CONTACT</h2>
          </div>
          <div class="h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent mb-12"></div>
          
          <div class="max-w-2xl mx-auto text-center">
            <div class="text-6xl mb-6">◈</div>
            <h3 class="jarvis-font text-3xl text-white mb-4">INITIATE COMMUNICATION</h3>
            <p class="text-slate-400 mb-10">
              Ready to build something extraordinary? Let's connect and discuss your next project.
            </p>
            
            <a href="https://www.instagram.com/abrar.codes" target="_blank" rel="noopener"
               class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span class="mono-font">@abrar.codes</span>
            </a>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-cyan-400/10 py-8">
      <div class="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="mono-font text-xs text-slate-500">
          <span class="text-cyan-400">◈</span> JARVIS PORTFOLIO SYSTEM v2.0
        </p>
        <p class="mono-font text-xs text-slate-500">
          &copy; {{ currentYear }} ABRAR DHALWALA
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AIFace from './components/AIFace.vue'


const aiFaceEnabled = ref(true)
const systemTime = ref('')
const typedText = ref('')
const activeSectionIndex = ref(0)

const currentYear = new Date().getFullYear()

const typingPhrases = [
  'Full-Stack Software Engineer',
  'Building scalable web applications',
  'Vue.js | React | NestJS | Laravel',
  'UAE-based, worldwide reach'
]

const stats = [
  { value: '10+', label: 'YEARS EXP' },
  { value: '50+', label: 'PROJECTS' },
  { value: '20+', label: 'CLIENTS' }
]

const coreSkills = [
  { name: 'Backend', detail: 'Node, Python, Go', icon: '⚡' },
  { name: 'Frontend', detail: 'Vue, React, Next', icon: '🎨' },
  { name: 'Database', detail: 'MySQL, Mongo, Redis', icon: '🗄️' },
  { name: 'DevOps', detail: 'AWS, Docker, CI/CD', icon: '🔧' }
]

const experience = [
  { company: 'MyWhoosh', role: 'Senior Software Engineer', period: 'Aug 2022 — Present', description: 'Building high-performance cycling simulation platform with real-time data processing and 3D rendering capabilities.' },
  { company: 'Bacancy Technology', role: 'Senior Software Engineer', period: 'Jan 2022 — Jul 2022', description: 'Led development of enterprise SaaS solutions using Node.js and React, serving clients across multiple industries.' },
  { company: 'Aecor Digital', role: 'Senior Software Engineer', period: 'Mar 2020 — Dec 2021', description: 'Architected microservices infrastructure and implemented CI/CD pipelines for scalable applications.' },
  { company: 'Netweb Software', role: 'Software Engineer', period: 'Feb 2017 — Mar 2020', description: 'Developed web applications and APIs using Laravel and Vue.js for diverse client requirements.' }
]

const skillCategories = [
  { name: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Go'] },
  { name: 'FRAMEWORKS', items: ['Vue 3', 'React', 'NextJS', 'NestJS', 'Laravel', 'FastAPI'] },
  { name: 'DATABASES', items: ['MySQL', 'MongoDB', 'Redis', 'RabbitMQ'] },
  { name: 'CLOUD', items: ['AWS S3', 'AWS Lambda', 'AWS EC2', 'Vercel'] },
  { name: 'TOOLS', items: ['Docker', 'Git', 'Jest', 'SonarQube', 'Jira'] }
]

const techStack = [
  { name: 'Vue.js', icon: '💚' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Python', icon: '🐍' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Docker', icon: '🦦' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Linux', icon: '🐧' }
]

const aiFaceRef = ref(null)

function toggleAIFace() {
  if (aiFaceRef.value) {
    if (aiFaceRef.value.isRunning) {
      aiFaceRef.value.stop()
    } else {
      aiFaceRef.value.start()
    }
  }
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function updateTime() {
  const now = new Date()
  systemTime.value = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Dubai' }) + ' GST'
}

// Typewriter effect
let phraseIndex = 0
let charIndex = 0
let isDeleting = false

function typeWriter() {
  const current = typingPhrases[phraseIndex]
  
  if (isDeleting) {
    typedText.value = current.substring(0, charIndex - 1)
    charIndex--
  } else {
    typedText.value = current.substring(0, charIndex + 1)
    charIndex++
  }

  let delay = isDeleting ? 30 : 60

  if (!isDeleting && charIndex === current.length) {
    delay = 2000
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    phraseIndex = (phraseIndex + 1) % typingPhrases.length
    delay = 500
  }

  setTimeout(typeWriter, delay)
}

// Intersection observer for active section
function setupScrollObserver() {
  const sections = ['hero', 'about', 'experience', 'skills', 'education', 'contact']
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = sections.indexOf(entry.target.id)
        if (index !== -1) activeSectionIndex.value = index
      }
    })
  }, { threshold: 0.5 })

  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
}

let timeInterval = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  typeWriter()
  setupScrollObserver()
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (aiFaceRef.value) aiFaceRef.value.stop()
})
</script>
