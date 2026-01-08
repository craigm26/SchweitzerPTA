-- Migration to rename sponsors to donors and remove levels
ALTER TABLE IF EXISTS public.sponsors RENAME TO donors;

-- Remove the level column
ALTER TABLE public.donors DROP COLUMN IF EXISTS level;

-- If there are any foreign keys or other objects that need renaming:
-- (Checking for common patterns in this project)
-- The current schema seems simple, but let's be thorough.

-- Update any comments if they exist
COMMENT ON TABLE public.donors IS 'Table for storing donor (formerly sponsor) information';

-- If there's an RLS policy with a name that includes 'sponsors', it should be updated, 
-- but renaming the table often handles policy attachment. 
-- However, we might want to rename the policies for clarity.

-- Rename policies if they exist (Supabase specific)
-- This is optional but good for consistency.
-- ALTER POLICY "Allow public read access to sponsors" ON public.donors RENAME TO "Allow public read access to donors";
