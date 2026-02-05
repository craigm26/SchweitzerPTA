-- Fundraiser events table
CREATE TABLE IF NOT EXISTS public.fundraiser_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT,
  end_time TEXT,
  location TEXT NOT NULL,
  image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_all_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.fundraiser_events ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Fundraisers are viewable by everyone" ON public.fundraiser_events;
DROP POLICY IF EXISTS "Editors and admins can manage fundraisers" ON public.fundraiser_events;

CREATE POLICY "Fundraisers are viewable by everyone" ON public.fundraiser_events
  FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage fundraisers" ON public.fundraiser_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- updated_at trigger
DROP TRIGGER IF EXISTS update_fundraiser_events_updated_at ON public.fundraiser_events;
CREATE TRIGGER update_fundraiser_events_updated_at
  BEFORE UPDATE ON public.fundraiser_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
