<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { listLinks, deleteLink } from '../services/links'
import { supabase, shortUrl } from '../services/supabase'
const router = useRouter()
const rows = ref([]); const total = ref(0); const page = ref(0); const search = ref('')
const loading = ref(true); const error = ref(''); const size = 10
async function load() {
  loading.value = true; error.value = ''
  try { const r = await listLinks({ page: page.value, size, search: search.value }); rows.value = r.data; total.value = r.count }
  catch { error.value = 'Could not load your links. Try again.' } finally { loading.value = false }
}
async function remove(l) {
  if (!confirm(`Delete ${shortUrl(l.short_code)}? This cannot be undone.`)) return
  await deleteLink(l.id); load()
}
const copy = (l) => navigator.clipboard.writeText(shortUrl(l.short_code))
async function logout() { await supabase.auth.signOut(); router.push('/') }
watch(search, () => { page.value = 0; load() })
onMounted(load)
</script>
<template>
  <main class="mx-auto max-w-5xl px-4 py-10">
    <div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-ink">Your links</h1><button class="text-sm underline" @click="logout">Log out</button></div>
    <label for="s" class="sr-only">Search links</label>
    <input id="s" v-model.trim="search" placeholder="Search links" class="mt-4 w-full rounded-lg border px-3 py-2" />
    <p v-if="loading" class="mt-6 text-muted">Loading…</p>
    <p v-else-if="error" role="alert" class="mt-6 text-red-700">{{ error }}</p>
    <p v-else-if="!rows.length" class="mt-6 text-muted">No links yet. Shorten a link from the home page while signed in.</p>
    <ul v-else class="mt-4 divide-y rounded-xl border bg-white">
      <li v-for="l in rows" :key="l.id" class="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
        <div class="min-w-0"><p class="font-semibold text-teal">{{ shortUrl(l.short_code) }}</p><p class="truncate text-muted">{{ l.original_url }}</p>
          <p class="text-xs text-muted">{{ new Date(l.created_at).toLocaleDateString() }} · {{ l.click_count }} clicks</p></div>
        <div class="flex gap-2"><button class="rounded border px-3 py-1" @click="copy(l)">Copy</button><button class="rounded border border-red-300 px-3 py-1 text-red-700" @click="remove(l)">Delete</button></div>
      </li>
    </ul>
    <div class="mt-4 flex gap-2"><button :disabled="page === 0" class="rounded border px-3 py-1 disabled:opacity-40" @click="page--; load()">Previous</button><button :disabled="(page + 1) * size >= total" class="rounded border px-3 py-1 disabled:opacity-40" @click="page++; load()">Next</button></div>
  </main>
</template>
