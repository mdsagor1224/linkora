<script setup>
import { ref, onMounted } from 'vue'
import UrlShortenerForm from '../components/UrlShortenerForm.vue'
const recent = ref([])
onMounted(() => (recent.value = JSON.parse(localStorage.getItem('recent') || '[]')))
const features = [
  ['Link analytics', 'See total clicks for every link you create while signed in.'],
  ['Custom short links', 'Pick your own alias. Taken aliases are rejected by the database.'],
  ['QR code generator', 'Make a QR code for any short link and download it as a PNG.'],
  ['Link management', 'Search, copy and delete your links from one dashboard.']
]
const faqs = [
  ['What is a URL shortener?', 'A service that turns a long web address into a short one that redirects to the original.'],
  ['Are short links permanent?', 'Links stay active until you delete them or they expire.'],
  ['Can I customize my short links?', 'Yes. Enter an alias of 4–32 letters, numbers, hyphens or underscores.'],
  ['Can I generate QR codes?', 'Yes. Use the QR tab or the QR button on a new link.'],
  ['Is registration required?', 'No. Sign up to manage links and see click counts.']
]
</script>
<template>
  <main>
    <section class="bg-navy text-white">
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <h1 class="text-4xl font-extrabold leading-tight md:text-5xl">Short Links. Bigger Possibilities.</h1>
          <p class="mt-4 max-w-md text-slate-200">Create shorter, smarter links in seconds. Track clicks, customize your URLs, and share them anywhere.</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <router-link to="/app/register" class="rounded-lg bg-cyan px-5 py-3 font-semibold text-deep">Start Shortening Free</router-link>
            <a href="#features" class="rounded-lg border border-white/40 px-5 py-3 font-semibold">Explore Features</a>
          </div>
        </div>
        <UrlShortenerForm />
      </div>
    </section>
    <section v-if="recent.length" class="mx-auto max-w-6xl px-4 py-8">
      <h2 class="text-lg font-bold">Recent links on this device</h2>
      <ul class="mt-3 space-y-2 text-sm"><li v-for="r in recent" :key="r.short" class="truncate"><a :href="r.short" class="font-semibold text-teal">{{ r.short }}</a> <span class="text-muted">→ {{ r.url }}</span></li></ul>
    </section>
    <section id="features" class="bg-mist py-16">
      <div class="mx-auto max-w-6xl px-4">
        <h2 class="text-3xl font-bold text-ink">Everything you need to manage links</h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="[t, d] in features" :key="t" class="rounded-xl border border-slate-200 bg-white p-5"><h3 class="font-bold text-ink">{{ t }}</h3><p class="mt-2 text-sm text-muted">{{ d }}</p></article>
        </div>
      </div>
    </section>
    <section id="faq" class="mx-auto max-w-3xl px-4 py-16">
      <h2 class="text-3xl font-bold text-ink">Frequently asked questions</h2>
      <div class="mt-6 divide-y rounded-xl border">
        <details v-for="[q, a] in faqs" :key="q" class="p-4"><summary class="cursor-pointer font-semibold text-ink">{{ q }}</summary><p class="mt-2 text-muted">{{ a }}</p></details>
      </div>
    </section>
    <section id="cta" class="bg-navy py-16 text-center text-white">
      <h2 class="text-3xl font-bold">Ready to Create Smarter Links?</h2>
      <p class="mt-2 text-slate-200">Turn long URLs into clean, shareable links in seconds.</p>
      <router-link to="/app/register" class="mt-6 inline-block rounded-lg bg-cyan px-5 py-3 font-semibold text-deep">Create Free Account</router-link>
    </section>
  </main>
  <footer class="bg-deep py-8 text-sm text-slate-300"><div class="mx-auto max-w-6xl px-4">© {{ new Date().getFullYear() }} Linkora. All rights reserved.</div></footer>
</template>
