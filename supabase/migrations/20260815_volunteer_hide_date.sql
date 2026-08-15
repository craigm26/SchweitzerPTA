-- Volunteer events that have no set date (ongoing / anytime opportunities).
-- The Volunteer page shows "No set date" instead of a date, and the upcoming filter
-- in /api/volunteer-events lets these events through regardless of their date column
-- so they don't silently disappear once a placeholder date passes.
alter table calendar_events
  add column if not exists volunteer_hide_date boolean not null default false;
