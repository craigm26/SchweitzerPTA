-- Auction Items table and policies

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- AUCTION ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.auction_items (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER REFERENCES public.donors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL DEFAULT 'silent' CHECK (item_type IN ('live', 'silent')),
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
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

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_auction_items_updated_at ON public.auction_items;
CREATE TRIGGER update_auction_items_updated_at BEFORE UPDATE ON public.auction_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STORAGE BUCKET FOR AUCTION ITEM PHOTOS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('auction-item-photos', 'auction-item-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access
DROP POLICY IF EXISTS "Auction Item Photos Public Access" ON storage.objects;
CREATE POLICY "Auction Item Photos Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'auction-item-photos' );

-- Policy: Allow authenticated users (admins/editors) to upload
DROP POLICY IF EXISTS "Auction Item Photos Authenticated Upload" ON storage.objects;
CREATE POLICY "Auction Item Photos Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'auction-item-photos'
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
);

-- Policy: Allow authenticated users (admins/editors) to update
DROP POLICY IF EXISTS "Auction Item Photos Authenticated Update" ON storage.objects;
CREATE POLICY "Auction Item Photos Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'auction-item-photos'
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
);

-- Policy: Allow authenticated users (admins/editors) to delete
DROP POLICY IF EXISTS "Auction Item Photos Authenticated Delete" ON storage.objects;
CREATE POLICY "Auction Item Photos Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'auction-item-photos'
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
);
