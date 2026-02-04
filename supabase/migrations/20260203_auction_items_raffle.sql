-- Add raffle item type and YouTube support for auction items

ALTER TABLE public.auction_items
  ADD COLUMN IF NOT EXISTS youtube_url TEXT;

ALTER TABLE public.auction_items
  DROP CONSTRAINT IF EXISTS auction_items_item_type_check;

ALTER TABLE public.auction_items
  ADD CONSTRAINT auction_items_item_type_check
  CHECK (item_type IN ('live', 'silent', 'raffle'));
