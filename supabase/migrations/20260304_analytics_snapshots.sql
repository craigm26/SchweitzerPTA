-- Imported analytics snapshots (for backfilling from Vercel dashboard)
create table if not exists public.analytics_snapshots (
  id bigserial primary key,
  source text not null default 'vercel_import',
  period_days integer not null check (period_days > 0 and period_days <= 365),
  visitors integer not null check (visitors >= 0),
  page_views integer not null check (page_views >= 0),
  bounce_rate numeric(5,2) check (bounce_rate >= 0 and bounce_rate <= 100),
  top_page text,
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.analytics_snapshots enable row level security;

create index if not exists analytics_snapshots_period_days_idx
  on public.analytics_snapshots (period_days, captured_at desc);

drop policy if exists "Admins can read analytics snapshots" on public.analytics_snapshots;
create policy "Admins can read analytics snapshots"
  on public.analytics_snapshots
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

drop policy if exists "Admins can insert analytics snapshots" on public.analytics_snapshots;
create policy "Admins can insert analytics snapshots"
  on public.analytics_snapshots
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
