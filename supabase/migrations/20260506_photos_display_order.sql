-- Migration: photos.display_order for per-event manual ordering
-- Admin can reorder photos within an event (or other context). NULL means
-- "use the date-based fallback ordering"; non-NULL floats the photo above
-- date-based peers within the same event.

ALTER TABLE public.photos
  ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Composite index supports the gallery sort: event_id first so per-event
-- queries hit it, display_order then date_taken for the actual ordering.
CREATE INDEX IF NOT EXISTS idx_photos_event_display_order
  ON public.photos(event_id, display_order, date_taken DESC);
