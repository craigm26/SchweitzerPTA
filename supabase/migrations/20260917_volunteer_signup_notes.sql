-- Per-shift "Notes" question on volunteer signups.
--
-- Some shifts need one extra free-text answer from the volunteer — Game Station asks for
-- a station preference or a person to be paired with. This is opt-in PER SHIFT so the
-- question only appears where it is wanted, and the wording is editable in the admin
-- screen rather than hard-coded here.
--
-- Three flags on the shift, one column on the signup:
--   notes_enabled  - show the Notes box on the public signup form for this shift
--   notes_label    - the question wording (NULL = fall back to the default in the app)
--   notes_public   - also show the collected notes on the public volunteer page
--   notes          - what the volunteer typed
--
-- notes_public defaults FALSE everywhere. Collected notes are admin-only until someone
-- deliberately turns that on per shift.

alter table public.event_volunteer_shifts
  add column if not exists notes_enabled boolean not null default false;

alter table public.event_volunteer_shifts
  add column if not exists notes_label text;

alter table public.event_volunteer_shifts
  add column if not exists notes_public boolean not null default false;

alter table public.event_volunteer_signups
  add column if not exists notes text;

-- Public read path for the volunteer roster.
--
-- event_volunteer_signups is RLS-locked to the signer and to admin/editor, and that must
-- stay that way — the table holds every volunteer's email. So the public page does NOT
-- read the table. It reads this view, which is column-limited (no email, no user_id, no
-- status) and row-limited to signups that still stand on a live shift.
--
-- The view is deliberately NOT security_invoker: it runs as its owner so it can see past
-- the base table's RLS, and the GRANT below is the only thing that opens it up.
--
-- One view serves both jobs. The name is always exposed (the roster on the volunteer
-- page). The note is exposed ONLY for a shift an admin has explicitly flagged
-- notes_public — otherwise it comes back NULL and never leaves the database.
drop view if exists public.public_volunteer_shift_notes;
drop view if exists public.public_volunteer_shift_roster;

create view public.public_volunteer_shift_roster as
select
  s.id,
  s.shift_id,
  btrim(s.name) as name,
  case
    when sh.notes_enabled = true and sh.notes_public = true
      then nullif(btrim(coalesce(s.notes, '')), '')
    else null
  end as notes,
  s.created_at
from public.event_volunteer_signups s
join public.event_volunteer_shifts sh on sh.id = s.shift_id
where sh.is_active = true
  and coalesce(s.status, 'pending') <> 'cancelled'
  and btrim(coalesce(s.name, '')) <> '';

grant select on public.public_volunteer_shift_roster to anon, authenticated;
