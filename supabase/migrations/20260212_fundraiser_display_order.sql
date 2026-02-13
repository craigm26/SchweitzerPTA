-- Add display ordering support for fundraiser events
ALTER TABLE public.fundraiser_events
ADD COLUMN IF NOT EXISTS display_order INTEGER;

UPDATE public.fundraiser_events
SET display_order = 0
WHERE display_order IS NULL;

ALTER TABLE public.fundraiser_events
ALTER COLUMN display_order SET DEFAULT 0;

ALTER TABLE public.fundraiser_events
ALTER COLUMN display_order SET NOT NULL;
