-- Add active flag and website URL to fundraiser events
ALTER TABLE public.fundraiser_events ADD COLUMN IF NOT EXISTS website_url TEXT;

ALTER TABLE public.fundraiser_events ADD COLUMN IF NOT EXISTS is_active BOOLEAN;
UPDATE public.fundraiser_events SET is_active = TRUE WHERE is_active IS NULL;
ALTER TABLE public.fundraiser_events ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE public.fundraiser_events ALTER COLUMN is_active SET NOT NULL;
