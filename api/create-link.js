import { createClient } from '@supabase/supabase-js'
import { randomBytes, createHash } from 'node:crypto'
import { validateUrl, validateAlias } from '../src/lib/validate.js'

const db = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const ALPHABET = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function generateCode(len = 7) {
  const b = randomBytes(len)
  return Array.from(b, (x) => ALPHABET[x % ALPHABET.length]).join('')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const url = validateUrl(req.body?.url)
  const alias = req.body?.alias?.trim() || null
  if (!url) return res.status(400).json({ error: 'Enter a valid http or https URL.' })
  if (!validateAlias(alias)) return res.status(400).json({ error: 'Alias must be 4–32 letters, numbers, - or _.' })

  const supabase = db()
  // Optional auth: attach ownership when a valid bearer token is sent.
  let userId = null
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) userId = (await supabase.auth.getUser(token)).data?.user?.id ?? null

  // Rate limit: 20 links/hour per hashed IP (anonymous) — IP is hashed, never stored raw.
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  const creator_hash = createHash('sha256').update(ip + process.env.IP_HASH_SALT).digest('hex')
  const since = new Date(Date.now() - 3600_000).toISOString()
  const { count } = await supabase.from('links').select('id', { count: 'exact', head: true })
    .eq('creator_hash', creator_hash).gte('created_at', since)
  if ((count ?? 0) >= 20) return res.status(429).json({ error: 'Too many links created. Try again later.' })

  // Unique constraints are the source of truth; retry random codes on collision.
  for (let i = 0; i < 5; i++) {
    const short_code = alias || generateCode()
    const { data, error } = await supabase.from('links')
      .insert({ original_url: url, short_code, custom_alias: alias, user_id: userId, creator_hash })
      .select('short_code, created_at').single()
    if (!error) return res.status(201).json(data)
    if (error.code === '23505') {
      if (alias) return res.status(409).json({ error: 'That alias is already taken.' })
      continue
    }
    return res.status(500).json({ error: 'Could not create link.' })
  }
  return res.status(500).json({ error: 'Could not create link.' })
}
