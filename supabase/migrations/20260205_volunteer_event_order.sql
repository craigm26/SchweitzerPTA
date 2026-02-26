ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS volunteer_display_order INTEGER;
