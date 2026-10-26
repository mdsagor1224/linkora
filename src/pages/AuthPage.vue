<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
const props = defineProps({ mode: String })
const router = useRouter()
const email = ref(''); const password = ref(''); const error = ref(''); const info = ref('')
async function submit() {
  error.value = info.value = ''
  const fn = props.mode === 'login' ? 'signInWithPassword' : 'signUp'
  const { data, error: e } = await supabase.auth[fn]({ email: email.value, password: password.value })
  if (e) return (error.value = e.message)
  if (data.session) router.push('/app/dashboard')
  else info.value = 'Check your email to confirm your account, then log in.'
}
</script>
<template>
  <main class="mx-auto max-w-sm px-4 py-16">
    <h1 class="text-2xl font-bold text-ink">{{ mode === 'login' ? 'Log in' : 'Create your account' }}</h1>
    <div class="mt-6 space-y-3">
      <label for="email" class="block text-sm font-medium">Email</label>
      <input id="email" v-model="email" type="email" autocomplete="email" class="w-full rounded-lg border px-3 py-3" />
      <label for="pw" class="block text-sm font-medium">Password</label>
      <input id="pw" v-model="password" type="password" minlength="8" autocomplete="current-password" class="w-full rounded-lg border px-3 py-3" @keyup.enter="submit" />
      <button class="w-full rounded-lg bg-teal py-3 font-semibold text-white" @click="submit">{{ mode === 'login' ? 'Log in' : 'Sign up' }}</button>
      <p v-if="error" role="alert" class="text-sm text-red-700">{{ error }}</p>
      <p v-if="info" class="text-sm text-green-700">{{ info }}</p>
    </div>
  </main>
</template>
