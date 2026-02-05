-- Schweitzer PTA Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'member')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Policies for news
CREATE POLICY "Published news is viewable by everyone" ON public.news
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Editors and admins can insert news" ON public.news
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can update news" ON public.news
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete news" ON public.news
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT,
  end_time TEXT,
  location TEXT NOT NULL,
  category TEXT,
  image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_all_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- FUNDRAISER EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.fundraiser_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE,
  end_date DATE,
  time TEXT,
  end_time TEXT,
  location TEXT,
  image TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_all_day BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.fundraiser_events ENABLE ROW LEVEL SECURITY;

-- Policies for fundraisers
CREATE POLICY "Fundraisers are viewable by everyone" ON public.fundraiser_events
  FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage fundraisers" ON public.fundraiser_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- DONORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.donors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  level TEXT, -- Optional: bronze, silver, gold, platinum
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Policies for donors
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
-- AUCTION ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.auction_items (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER REFERENCES public.donors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  sponsor_text TEXT,
  item_type TEXT NOT NULL DEFAULT 'silent' CHECK (item_type IN ('live', 'silent', 'raffle')),
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  youtube_url TEXT,
  estimated_value NUMERIC,
  restrictions TEXT,
  quantity INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.auction_items ENABLE ROW LEVEL SECURITY;

-- Policies for auction items
CREATE POLICY "Active auction items are viewable by everyone" ON public.auction_items
  FOR SELECT USING (is_active = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Editors and admins can manage auction items" ON public.auction_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- VOLUNTEER OPPORTUNITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE,
  time_commitment TEXT NOT NULL,
  spots_available INTEGER NOT NULL DEFAULT 0,
  spots_filled INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;

-- Policies for volunteer opportunities
CREATE POLICY "Active opportunities are viewable by everyone" ON public.volunteer_opportunities
  FOR SELECT USING (is_active = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Editors and admins can manage opportunities" ON public.volunteer_opportunities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- VOLUNTEER SIGNUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.volunteer_signups (
  id SERIAL PRIMARY KEY,
  opportunity_id INTEGER REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;

-- Policies for volunteer signups
CREATE POLICY "Users can view their own signups" ON public.volunteer_signups
  FOR SELECT USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Anyone can signup" ON public.volunteer_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage signups" ON public.volunteer_signups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for contact submissions
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage submissions" ON public.contact_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fundraiser_events_updated_at BEFORE UPDATE ON public.fundraiser_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auction_items_updated_at BEFORE UPDATE ON public.auction_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteer_opportunities_updated_at BEFORE UPDATE ON public.volunteer_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================
-- Uncomment below to add sample data

/*
-- Sample donors
INSERT INTO public.donors (name, website, logo, description, is_active) VALUES
  ('Tech Solutions Inc.', 'https://techsolutions.example.com', '🏢', 'Local technology partner', true),
  ('Main Street Pizza', 'https://mainstreetpizza.example.com', '🍕', 'Providing lunch for volunteers', true),
  ('First National Bank', 'https://fnb.example.com', '🏦', 'Matching donation partner', true),
  ('Schweitzer Realty Group', 'https://schweitzerrealty.example.com', '🏠', 'Community support', true),
  ('Local Market', 'https://localmarket.example.com', '🛒', 'School supplies donor', true),
  ('The Diner', 'https://thediner.example.com', '🍽️', 'Teacher appreciation lunches', true);

-- Sample events
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('Fall Festival', 'Annual fall festival with games, food, and fun for the whole family!', '2024-10-28', '10:00 AM', 'School Playground', 'Fundraiser', true),
  ('PTA General Meeting', 'Monthly PTA meeting to discuss upcoming events and initiatives.', '2024-11-12', '7:00 PM', 'Library', 'Meeting', false),
  ('Thanksgiving Feast', 'School-wide Thanksgiving celebration with traditional dishes.', '2024-11-24', '11:00 AM', 'Cafeteria', 'Community', true),
  ('Winter Concert', 'Annual winter concert featuring performances by all grade levels.', '2024-12-15', '6:30 PM', 'Auditorium', 'Performance', true),
  ('Book Fair', 'Scholastic Book Fair - great books for young readers!', '2024-11-06', '8:00 AM', 'Library', 'Fundraiser', false);

-- Sample volunteer opportunities
INSERT INTO public.volunteer_opportunities (title, description, date, time_commitment, spots_available, spots_filled, category, is_active) VALUES
  ('Book Fair Helper', 'Help students and parents find great books during our Scholastic Book Fair.', '2024-11-06', '2 hours', 10, 3, 'Events', true),
  ('Fall Festival Booth', 'Run a game booth at our annual Fall Festival.', '2024-10-28', '2 hours', 20, 12, 'Events', true),
  ('Classroom Reading', 'Read stories to kindergarten and first grade classes.', NULL, '1 hour/week', 8, 5, 'Classroom', true),
  ('Library Assistant', 'Help organize and shelve books in the school library.', NULL, '2 hours/week', 4, 2, 'Ongoing', true);
*/

