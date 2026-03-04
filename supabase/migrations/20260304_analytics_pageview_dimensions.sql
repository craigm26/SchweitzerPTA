-- Additional dimensions for first-party analytics
alter table public.analytics_pageviews
  add column if not exists page_title text,
  add column if not exists browser_name text;

create index if not exists analytics_pageviews_browser_name_idx
  on public.analytics_pageviews (browser_name);

create index if not exists analytics_pageviews_path_title_idx
  on public.analytics_pageviews (path, page_title);
