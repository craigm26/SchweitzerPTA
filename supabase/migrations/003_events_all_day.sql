-- Events All-Day and End Date Migration
-- Run this in your Supabase SQL Editor

-- Add end_date column for multi-day events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add is_all_day column for all-day events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT FALSE;

-- Make time column nullable for all-day events
ALTER TABLE public.events ALTER COLUMN time DROP NOT NULL;

-- Update existing events to set is_all_day based on time being null
UPDATE public.events SET is_all_day = TRUE WHERE time IS NULL;
