-- Migration: Add PDF flyer columns to events table
-- For the events page redesign: each event can optionally have a PDF flyer
-- with an auto-generated first-page thumbnail.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS pdf_filename TEXT,
  ADD COLUMN IF NOT EXISTS pdf_thumbnail_url TEXT;
