-- Add volunteer visibility flag to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS volunteer_active BOOLEAN;
UPDATE public.events SET volunteer_active = FALSE WHERE volunteer_active IS NULL;
ALTER TABLE public.events ALTER COLUMN volunteer_active SET DEFAULT FALSE;
ALTER TABLE public.events ALTER COLUMN volunteer_active SET NOT NULL;

-- Event volunteer shifts (per-event job slots)
CREATE TABLE IF NOT EXISTS public.event_volunteer_shifts (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  shift_description TEXT,
  start_time TEXT,
  end_time TEXT,
  spots_available INTEGER NOT NULL DEFAULT 1,
  spots_filled INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event volunteer signups (per-shift signups)
CREATE TABLE IF NOT EXISTS public.event_volunteer_signups (
  id SERIAL PRIMARY KEY,
  shift_id INTEGER NOT NULL REFERENCES public.event_volunteer_shifts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.event_volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_volunteer_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active shifts are viewable by everyone" ON public.event_volunteer_shifts;
DROP POLICY IF EXISTS "Editors and admins can manage event volunteer shifts" ON public.event_volunteer_shifts;

CREATE POLICY "Active shifts are viewable by everyone" ON public.event_volunteer_shifts
  FOR SELECT USING (
    is_active = TRUE OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = ANY (ARRAY['admin'::text, 'editor'::text])
    )
  );

CREATE POLICY "Editors and admins can manage event volunteer shifts" ON public.event_volunteer_shifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = ANY (ARRAY['admin'::text, 'editor'::text])
    )
  );

DROP POLICY IF EXISTS "Admins can manage event volunteer signups" ON public.event_volunteer_signups;
DROP POLICY IF EXISTS "Anyone can signup for event shifts" ON public.event_volunteer_signups;
DROP POLICY IF EXISTS "Users can view their event signups" ON public.event_volunteer_signups;

CREATE POLICY "Admins can manage event volunteer signups" ON public.event_volunteer_signups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = ANY (ARRAY['admin'::text, 'editor'::text])
    )
  );

CREATE POLICY "Anyone can signup for event shifts" ON public.event_volunteer_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their event signups" ON public.event_volunteer_signups
  FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = ANY (ARRAY['admin'::text, 'editor'::text])
    )
  );

-- updated_at trigger for shifts
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_volunteer_shifts_updated_at ON public.event_volunteer_shifts;
CREATE TRIGGER update_event_volunteer_shifts_updated_at
  BEFORE UPDATE ON public.event_volunteer_shifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
