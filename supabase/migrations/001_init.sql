create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  short_code text not null unique check (short_code ~ '^[A-Za-z0-9_-]{4,32}$'),
  original_url text not null check (char_length(original_url) <= 2048 and original_url ~* '^https?://'),
  custom_alias text unique,
  creator_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  click_count bigint not null default 0
);
create table public.click_events (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  country_code text
);
create index on public.links (user_id, created_at desc);
create index on public.links (creator_hash, created_at);
create index on public.click_events (link_id, clicked_at);

alter table public.links enable row level security;
alter table public.click_events enable row level security;
-- No insert policy on links: creation goes through the server (service role).
create policy "own links read" on public.links for select using (auth.uid() = user_id);
create policy "own links delete" on public.links for delete using (auth.uid() = user_id);
create policy "own links update" on public.links for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own clicks read" on public.click_events for select
  using (exists (select 1 from public.links l where l.id = link_id and l.user_id = auth.uid()));

-- Atomic click recording, callable only by the service role.
create function public.record_click(p_link uuid, p_ref text) returns void
language sql security definer set search_path = public as $$
  insert into click_events (link_id, referrer) values (p_link, left(p_ref, 255));
  update links set click_count = click_count + 1 where id = p_link;
$$;
revoke all on function public.record_click from public, anon, authenticated;

-- Retention: delete click events older than 13 months (schedule with pg_cron).
-- select cron.schedule('prune-clicks','0 3 * * *',$$delete from click_events where clicked_at < now() - interval '13 months'$$);
