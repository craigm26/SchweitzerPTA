-- Migration: Create event-flyers storage bucket and RLS policies
-- Stores per-event PDF flyers and their auto-generated PNG thumbnails.
-- Public read so the public events page can render thumbnails and link to PDFs.
-- Writes restricted to admin/editor profiles, matching sponsor-logos pattern.

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-flyers', 'event-flyers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "event-flyers public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-flyers');

CREATE POLICY "event-flyers admin/editor insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-flyers'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "event-flyers admin/editor update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-flyers'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "event-flyers admin/editor delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-flyers'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
