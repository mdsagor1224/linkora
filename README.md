# Linkora – URL shortener (Vue 3 + Vite + Tailwind + Supabase + Vercel)

## Local setup
1. `npm install` (Node 20+)
2. Create a Supabase project; run `supabase/migrations/001_init.sql` in the SQL editor.
3. `cp .env.example .env` and fill in values.
4. `npm run dev` for the UI. API routes need `npx vercel dev` (installs the Vercel CLI on demand).
5. `npm test`, `npm run build`, `npm run preview`.

## Environment variables
Browser-safe: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PUBLIC_SHORT_DOMAIN`.
Server-only (Vercel settings, never commit): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `IP_HASH_SALT`.

## Deploy
1. Push to GitHub, import the repo in Vercel, add all variables above, deploy.
2. Add your short domain in Vercel (HTTPS is automatic) and set `VITE_PUBLIC_SHORT_DOMAIN` to it; redeploy.
3. In Supabase Auth settings, add your site URL.
4. SPA pages live under `/app/*`; any other 4–32 char path is treated as a short code (see `vercel.json`).

## Testing checklist
Create link (random + alias, duplicate alias → 409) · copy/open/QR download · visit short link and confirm 302 and click count · expired/disabled/deleted links show a message · sign up/login/logout · dashboard only shows your links · `javascript:`/`data:` URLs rejected · 21st link in an hour → 429 · 320px width has no horizontal scroll.

## Not yet implemented
Alias editing, expiration UI, analytics charts, statistics and promo sections, PNG favicon, Terms/Privacy pages, CAPTCHA, malicious-URL reporting. Add these before advertising them.
