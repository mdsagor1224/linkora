// Shared by frontend and API. Pure string checks only: the server never fetches user URLs (no SSRF).
export const RESERVED = ['app', 'api', 'login', 'register', 'dashboard', 'admin', 'terms', 'privacy']
export function validateUrl(input) {
  if (typeof input !== 'string' || input.length > 2048) return null
  let u
  try { u = new URL(input.trim()) } catch { return null }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  if (u.username || u.password) return null
  return u.toString()
}
export function validateAlias(alias) {
  if (!alias) return true
  return /^[A-Za-z0-9_-]{4,32}$/.test(alias) && !RESERVED.includes(alias.toLowerCase())
}
