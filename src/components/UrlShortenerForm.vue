<script setup>
import { ref } from 'vue'
import { validateUrl, validateAlias } from '../lib/validate'
import { createLink } from '../services/links'
import { shortUrl } from '../services/supabase'

const tab = ref('link')
const url = ref(''); const alias = ref('')
const loading = ref(false); const error = ref(''); const result = ref(null)
const copied = ref(false); const qr = ref('')

async function submit() {
  error.value = ''; result.value = null; qr.value = ''
  const clean = validateUrl(url.value)
  if (!clean) return (error.value = 'Enter a valid http or https URL.')
  if (!validateAlias(alias.value)) return (error.value = 'Alias must be 4–32 letters, numbers, - or _.')
  loading.value = true
  try {
    const r = await createLink(clean, alias.value.trim() || null)
    result.value = shortUrl(r.short_code)
    // Guests: keep recent links locally for convenience.
    const recent = JSON.parse(localStorage.getItem('recent') || '[]')
    localStorage.setItem('recent', JSON.stringify([{ short: result.value, url: clean }, ...recent].slice(0, 5)))
    if (tab.value === 'qr') await makeQr()
  } catch (e) { error.value = e.message } finally { loading.value = false }
}
async function makeQr() {
  const QRCode = (await import('qrcode')).default // loaded only when needed
  qr.value = await QRCode.toDataURL(result.value, { width: 256, margin: 2 })
}
async function copy() {
  await navigator.clipboard.writeText(result.value); copied.value = true; setTimeout(() => (copied.value = false), 1500)
}
const share = () => navigator.share?.({ url: result.value })
</script>
<template>
  <div class="rounded-2xl bg-white p-5 text-ink shadow-xl">
    <div role="tablist" class="mb-4 grid grid-cols-2 rounded-lg bg-mist p-1 text-sm font-semibold">
      <button role="tab" :aria-selected="tab === 'link'" :class="['rounded-md py-2', tab === 'link' && 'bg-white shadow']" @click="tab = 'link'">Shorten a Link</button>
      <button role="tab" :aria-selected="tab === 'qr'" :class="['rounded-md py-2', tab === 'qr' && 'bg-white shadow']" @click="tab = 'qr'">Generate QR Code</button>
    </div>
    <div class="space-y-3">
      <label class="block text-sm font-medium" for="long-url">Long URL</label>
      <input id="long-url" v-model="url" type="url" inputmode="url" placeholder="https://example.com/a/very/long/link" class="w-full rounded-lg border border-slate-300 px-3 py-3" @keyup.enter="submit" />
      <template v-if="tab === 'link'">
        <label class="block text-sm font-medium" for="alias">Custom alias (optional)</label>
        <input id="alias" v-model="alias" maxlength="32" placeholder="my-link" class="w-full rounded-lg border border-slate-300 px-3 py-3" />
      </template>
      <button :disabled="loading" class="w-full rounded-lg bg-teal py-3 font-semibold text-white hover:bg-cyan disabled:opacity-60" @click="submit">
        {{ loading ? 'Shortening…' : tab === 'link' ? 'Shorten URL' : 'Create QR code' }}
      </button>
      <p v-if="error" role="alert" class="text-sm text-red-700">{{ error }}</p>
    </div>
    <div v-if="result" class="mt-4 rounded-lg bg-mist p-3" aria-live="polite">
      <p class="text-sm font-medium text-green-700">Your short link is ready</p>
      <a :href="result" target="_blank" rel="noopener" class="break-all font-semibold text-teal">{{ result }}</a>
      <div class="mt-3 flex flex-wrap gap-2 text-sm">
        <button class="rounded-md bg-navy px-3 py-2 text-white" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
        <a :href="result" target="_blank" rel="noopener" class="rounded-md border px-3 py-2">Open link</a>
        <button v-if="!qr" class="rounded-md border px-3 py-2" @click="makeQr">QR code</button>
        <button v-if="'share' in navigator" class="rounded-md border px-3 py-2" @click="share">Share</button>
      </div>
      <div v-if="qr" class="mt-3"><img :src="qr" width="160" height="160" alt="QR code for your short link" /><a :href="qr" download="linkora-qr.png" class="text-sm text-teal underline">Download PNG</a></div>
    </div>
  </div>
</template>
