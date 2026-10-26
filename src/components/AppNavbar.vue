<script setup>
import { ref } from 'vue'
const open = ref(false)
const links = [['Home', '/'], ['Features', '/#features'], ['Pricing', '/#cta'], ['Resources', '/#faq']]
</script>
<template>
  <header class="sticky top-0 z-30 bg-deep/95 backdrop-blur text-white">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
        <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#13A8C7"/><path d="M36 10 18 36h12l-2 18 18-26H34z" fill="#031F38"/></svg>Linkora
      </router-link>
      <button class="md:hidden p-2" :aria-expanded="open" aria-controls="menu" aria-label="Toggle menu" @click="open = !open">☰</button>
      <ul id="menu" :class="[open ? 'flex' : 'hidden', 'md:flex absolute md:static left-0 right-0 top-full flex-col md:flex-row items-start md:items-center gap-4 bg-deep p-4 md:p-0']">
        <li v-for="[label, to] in links" :key="label"><router-link :to="to" class="hover:text-cyan" @click="open = false">{{ label }}</router-link></li>
        <li><router-link to="/app/login" class="hover:text-cyan">Login</router-link></li>
        <li><router-link to="/app/register" class="rounded-lg bg-teal px-4 py-2 font-semibold hover:bg-cyan">Sign Up</router-link></li>
      </ul>
    </nav>
  </header>
</template>
