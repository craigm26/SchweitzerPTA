-- Migration: photos.calendar_event_id
-- Photos can be tagged with either an "event" (events table — special PDF
-- events) or a calendar event (calendar_events — the main school calendar).
-- Existing event_id stays untouched; new column is independent and nullable.
-- A CHECK constraint enforces "at most one event reference set" so the
-- gallery code can rely on a single non-null ref per photo.

ALTER TABLE public.photos
  ADD COLUMN IF NOT EXISTS calendar_event_id INTEGER
    REFERENCES public.calendar_events(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_photos_calendar_event_id
  ON public.photos(calendar_event_id);

-- Composite index parallels idx_photos_event_display_order so per-calendar-event
-- queries also benefit from the manual ordering sort.
CREATE INDEX IF NOT EXISTS idx_photos_calendar_event_display_order
  ON public.photos(calendar_event_id, display_order, date_taken DESC);

-- Mutual exclusion: at most one of event_id / calendar_event_id is set.
-- DROP-then-ADD pattern keeps the migration re-runnable.
ALTER TABLE public.photos
  DROP CONSTRAINT IF EXISTS photos_one_event_ref_chk;
ALTER TABLE public.photos
  ADD CONSTRAINT photos_one_event_ref_chk
  CHECK (event_id IS NULL OR calendar_event_id IS NULL);
