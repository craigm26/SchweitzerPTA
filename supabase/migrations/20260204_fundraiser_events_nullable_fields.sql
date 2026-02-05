-- Allow optional fields for fundraisers
ALTER TABLE public.fundraiser_events ALTER COLUMN date DROP NOT NULL;
ALTER TABLE public.fundraiser_events ALTER COLUMN location DROP NOT NULL;
