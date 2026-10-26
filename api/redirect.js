import { createClient } from '@supabase/supabase-js'

const page = (res, status, title, msg) => res.status(status).setHeader('Content-Type', 'text/html; charset=utf-8')
  .send(`<!doctype html><meta name="viewport" content="width=device-width"><title>${title}</title><body style="font-family:system-ui;text-align:center;padding:4rem;color:#142334"><h1>${title}</h1><p>${msg}</p><a href="/">Go to Linkora</a>`)

export default async function handler(req, res) {
  const code = String(req.query.code || '')
  if (!/^[A-Za-z0-9_-]{4,32}$/.test(code)) return page(res, 404, 'Link not found', 'This short link does not exist.')
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: link } = await supabase.from('links')
    .select('id, original_url, is_active, expires_at').eq('short_code', code).maybeSingle()
  if (!link) return page(res, 404, 'Link not found', 'This short link does not exist or was deleted.')
  if (!link.is_active) return page(res, 410, 'Link disabled', 'The owner has disabled this link.')
  if (link.expires_at && new Date(link.expires_at) < new Date()) return page(res, 410, 'Link expired', 'This short link has expired.')

  // Send the redirect first, then record the click so analytics never delay the visitor.
  const track = supabase.rpc('record_click', { p_link: link.id, p_ref: req.headers.referer || null })
  res.setHeader('Cache-Control', 'private, no-store')
  res.redirect(302, link.original_url)
  await track
}
