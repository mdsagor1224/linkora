import { supabase } from './supabase'
export async function createLink(url, alias) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch('/api/create-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    body: JSON.stringify({ url, alias })
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error || 'Something went wrong.')
  return body
}
export async function listLinks({ page = 0, size = 10, search = '' }) {
  let q = supabase.from('links').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(page * size, page * size + size - 1)
  if (search) q = q.or(`short_code.ilike.%${search}%,original_url.ilike.%${search}%`)
  const { data, count, error } = await q
  if (error) throw error
  return { data, count }
}
export const deleteLink = (id) => supabase.from('links').delete().eq('id', id)
