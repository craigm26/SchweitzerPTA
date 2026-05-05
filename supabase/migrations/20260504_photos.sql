-- Migration: photos table + event-photos storage bucket
-- Public photo gallery tagged by school year and optional event.
-- - photos.school_year: 'YYYY-YYYY' (e.g. '2025-2026'), Aug 1 boundary, derived
--   in the app layer with admin override; CHECK validates the format.
-- - is_published: cheap takedown without DELETE.
-- - content_hash: optional sha256 of the original; unique partial index catches
--   accidental re-uploads.
-- - event_id ON DELETE SET NULL: deleting an event keeps its photos.
-- Storage bucket and policies mirror 20260429_event_flyers_bucket.sql
-- (public read, admin/editor write).

CREATE TABLE IF NOT EXISTS public.photos (
  id            SERIAL PRIMARY KEY,
  storage_path  TEXT NOT NULL,
  thumb_path    TEXT NOT NULL,
  medium_path   TEXT NOT NULL,
  width         INTEGER NOT NULL,
  height        INTEGER NOT NULL,
  mime_type     TEXT NOT NULL,
  file_size     INTEGER NOT NULL,
  caption       TEXT,
  alt_text      TEXT,
  date_taken    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  school_year   TEXT NOT NULL CHECK (school_year ~ '^[0-9]{4}-[0-9]{4}$'),
  event_id      INTEGER REFERENCES public.events(id) ON DELETE SET NULL,
  uploader_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content_hash  TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_school_year     ON public.photos(school_year);
CREATE INDEX IF NOT EXISTS idx_photos_event_id        ON public.photos(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_date_taken_pub  ON public.photos(is_published, date_taken DESC);
CREATE INDEX IF NOT EXISTS idx_photos_event_year      ON public.photos(school_year, event_id, date_taken DESC) WHERE is_published;
CREATE UNIQUE INDEX IF NOT EXISTS idx_photos_hash     ON public.photos(content_hash) WHERE content_hash IS NOT NULL;

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published photos are viewable by everyone"
  ON public.photos FOR SELECT
  USING (
    is_published = TRUE
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can insert photos"
  ON public.photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can update photos"
  ON public.photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can delete photos"
  ON public.photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON public.photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-photos', 'event-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "event-photos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-photos');

CREATE POLICY "event-photos admin/editor insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "event-photos admin/editor update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "event-photos admin/editor delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
