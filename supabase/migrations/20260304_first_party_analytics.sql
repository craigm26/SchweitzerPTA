-- First-party analytics pageview storage
create table if not exists public.analytics_pageviews (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),
  path text not null,
  referrer text,
  visitor_id uuid not null,
  session_id uuid not null,
  user_agent text,
  country text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop', 'bot', 'unknown')),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.analytics_pageviews enable row level security;

create index if not exists analytics_pageviews_occurred_at_idx
  on public.analytics_pageviews (occurred_at desc);

create index if not exists analytics_pageviews_path_idx
  on public.analytics_pageviews (path);

create index if not exists analytics_pageviews_session_id_idx
  on public.analytics_pageviews (session_id);

create index if not exists analytics_pageviews_visitor_id_idx
  on public.analytics_pageviews (visitor_id);

drop policy if exists "Anyone can insert analytics pageviews" on public.analytics_pageviews;
create policy "Anyone can insert analytics pageviews"
  on public.analytics_pageviews
  for insert
  to anon, authenticated
  with check (
    char_length(path) > 0
    and char_length(path) <= 2048
  );

drop policy if exists "Admins can read analytics pageviews" on public.analytics_pageviews;
create policy "Admins can read analytics pageviews"
  on public.analytics_pageviews
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
