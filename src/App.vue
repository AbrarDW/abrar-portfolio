<template>
  <div class="min-h-screen bg-[#0a0a0f]">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" class="text-xl font-bold tracking-tight">
          <span class="text-indigo-400">A</span><span class="text-white">D</span>
        </a>
        <div class="hidden sm:flex items-center gap-8 text-sm text-slate-400">
          <a href="#about" class="hover:text-white transition-colors">About</a>
          <a href="#experience" class="hover:text-white transition-colors">Experience</a>
          <a href="#skills" class="hover:text-white transition-colors">Skills</a>
          <a href="#contact" class="hover:text-white transition-colors">Contact</a>
        </div>
        <button @click="menuOpen = !menuOpen" class="sm:hidden text-slate-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- Mobile menu -->
      <div v-if="menuOpen" class="sm:hidden border-t border-white/5 px-6 py-4 space-y-3 text-sm text-slate-400">
        <a href="#about" @click="menuOpen=false" class="block hover:text-white transition-colors">About</a>
        <a href="#experience" @click="menuOpen=false" class="block hover:text-white transition-colors">Experience</a>
        <a href="#skills" @click="menuOpen=false" class="block hover:text-white transition-colors">Skills</a>
        <a href="#contact" @click="menuOpen=false" class="block hover:text-white transition-colors">Contact</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-screen flex items-center relative overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div class="max-w-6xl mx-auto px-6 pt-20">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Available for opportunities
          </div>
          <h1 class="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight">
            Hi, I'm <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Abrar</span> 👋
          </h1>
          <p class="text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed">
            Software Engineer. Building clean, scalable web applications that deliver real value.
          </p>
          <div class="flex items-center gap-4 pt-4">
            <a href="#contact" class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">
              Get in touch
            </a>
            <a href="#experience" class="px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 rounded-lg font-medium transition-all hover:bg-white/5">
              View experience
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="py-24">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold mb-4">About</h2>
        <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-10"></div>
        <div class="grid sm:grid-cols-2 gap-12 items-start">
          <div class="space-y-5 text-slate-400 leading-relaxed">
            <p>I'm a software engineer with over a decade of experience, passionate about turning smart ideas into elegant web applications. I've helped small startups and established teams bring their visions to life — always focusing on usability, performance, and clean code.</p>
            <p>Because I believe good software should just work — fast, secure, and easy to use. I love solving real problems and watching ideas become products that people rely on.</p>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white mb-4">What I enjoy doing</h3>
            <div class="flex items-start gap-3 text-slate-400">
              <span class="mt-1 text-indigo-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </span>
              <p>Crafting full-stack web applications — from backend services to interactive front-end experiences.</p>
            </div>
            <div class="flex items-start gap-3 text-slate-400">
              <span class="mt-1 text-indigo-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </span>
              <p>Working with modern tools and stacks: Node.js, TypeScript, JavaScript, PHP, Go, React/Vue, Next.js, MySQL, MongoDB, Redis, and more.</p>
            </div>
            <div class="flex items-start gap-3 text-slate-400">
              <span class="mt-1 text-indigo-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </span>
              <p>Collaborating closely with clients or teams to understand their needs, add value, and build solutions that feel intuitive and maintainable.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section id="experience" class="py-24">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold mb-4">Work Experience</h2>
        <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-10"></div>
        <div class="space-y-8">
          <div v-for="job in experience" :key="job.company" 
               class="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm border border-indigo-500/10">
                  {{ job.logo }}
                </div>
                <h3 class="text-lg font-semibold text-white">{{ job.company }}</h3>
              </div>
              <span class="text-sm text-slate-500 font-mono">{{ job.period }}</span>
            </div>
            <p class="text-indigo-400 text-sm font-medium mb-1">{{ job.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="py-24">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold mb-4">Skills</h2>
        <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-10"></div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="category in skillCategories" :key="category.name">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{{ category.name }}</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in category.items" :key="skill"
                    class="px-3 py-1.5 text-sm rounded-lg border border-white/5 bg-white/[0.02] text-slate-300 hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all duration-200 cursor-default">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="py-24">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold mb-4">Education</h2>
        <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-10"></div>
        <div class="p-6 rounded-2xl border border-white/5 bg-white/[0.02] max-w-lg">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm border border-indigo-500/10">
              M
            </div>
            <h3 class="text-lg font-semibold text-white">M S University, Vadodara</h3>
          </div>
          <p class="text-slate-400 text-sm">Diploma in Computer Engineering</p>
          <p class="text-slate-500 text-sm font-mono mt-1">2010 — 2014</p>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-24">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <div class="max-w-2xl mx-auto">
          <span class="text-5xl mb-6 block">✨</span>
          <h2 class="text-3xl font-bold mb-4">Get in Touch</h2>
          <p class="text-slate-400 mb-8 leading-relaxed">Want to chat? Just shoot me a DM with a direct question on Instagram and I'll respond whenever I can. I will ignore all soliciting.</p>
          <a href="https://www.instagram.com/abrar.codes" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram: @abrar.codes
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-8">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>&copy; {{ new Date().getFullYear() }} Abrar Dhalwala</p>
        <p class="font-mono text-xs">Built with Vue + Tailwind</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const experience = [
  { company: 'MyWhoosh', logo: 'M', role: 'Senior Software Engineer', period: 'Aug 2022 — Present' },
  { company: 'Bacancy Technology', logo: 'B', role: 'Senior Software Engineer', period: 'Jan 2022 — Jul 2022' },
  { company: 'Aecor Digital', logo: 'A', role: 'Senior Software Engineer', period: 'Mar 2020 — Dec 2021' },
  { company: 'Netweb Software Pvt Ltd', logo: 'N', role: 'Software Engineer', period: 'Feb 2017 — Mar 2020' },
  { company: 'Pixel Perfection', logo: 'P', role: 'Software Engineer', period: 'Aug 2015 — Aug 2016' },
]

const skillCategories = [
  {
    name: 'Languages',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Go']
  },
  {
    name: 'Frameworks',
    items: ['Vue', 'React', 'NextJS', 'NestJS', 'Laravel', 'FastAPI', 'Iris']
  },
  {
    name: 'Runtime & Databases',
    items: ['Node', 'MySQL', 'MongoDB', 'Redis', 'RabbitMQ']
  },
  {
    name: 'Cloud & DevOps',
    items: ['AWS S3', 'AWS Lambda', 'AWS EC2', 'Vercel']
  },
  {
    name: 'Quality & Tools',
    items: ['Jest', 'SonarQube', 'Jira', 'GitHub', 'GitLab']
  }
]
</script>