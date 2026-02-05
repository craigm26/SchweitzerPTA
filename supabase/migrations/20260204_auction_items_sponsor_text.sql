ALTER TABLE public.auction_items
  ADD COLUMN IF NOT EXISTS sponsor_text TEXT;
