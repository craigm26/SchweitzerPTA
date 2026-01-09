-- Migration to update existing database
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: Handle sponsors -> donors rename (if sponsors table exists)
-- ============================================

-- Check if sponsors table exists and donors doesn't, then rename
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sponsors')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'donors') THEN
    ALTER TABLE public.sponsors RENAME TO donors;
  END IF;
END $$;

-- ============================================
-- STEP 2: Create donors table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS public.donors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on donors
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Active donors are viewable by everyone" ON public.donors;
DROP POLICY IF EXISTS "Admins can manage donors" ON public.donors;

CREATE POLICY "Active donors are viewable by everyone" ON public.donors
  FOR SELECT USING (is_active = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage donors" ON public.donors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- STEP 3: Update events table with new columns
-- ============================================

-- Add end_date column if it doesn't exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add is_all_day column if it doesn't exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT FALSE;

-- Make time column nullable
ALTER TABLE public.events ALTER COLUMN time DROP NOT NULL;

-- Clean up "All Day" text values in time column (set to NULL)
UPDATE public.events SET time = NULL, is_all_day = TRUE WHERE time = 'All Day' OR time = 'all day';

-- ============================================
-- STEP 4: Ensure updated_at trigger exists
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donors if it doesn't exist
DROP TRIGGER IF EXISTS update_donors_updated_at ON public.donors;
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for events if it doesn't exist
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- DONE! Verify with:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- ============================================
