-- Migration: Insert 2026 Events
-- Description: Add events for January through April 2026

-- January 19: No School
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('No School', 'School holiday - no classes', '2026-01-19', 'All Day', 'School Closed', 'Holiday', false);

-- January 20: APEX Fundraiser Begins
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('APEX Fundraiser Begins', 'Annual APEX fundraising campaign begins', '2026-01-20', 'All Day', 'School-wide', 'Fundraiser', true);

-- January 29: APEX Fun Run
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('APEX Fun Run', 'Annual APEX Fun Run event', '2026-01-29', 'TBD', 'School Playground', 'Fundraiser', true);

-- February 3: PTA Meeting
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('PTA Meeting', 'Monthly PTA meeting to discuss upcoming events and initiatives', '2026-02-03', '5:00 PM', 'School Library', 'Meeting', false);

-- February 16-20: No School (create individual events for each day)
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('No School', 'School holiday - no classes', '2026-02-16', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-02-17', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-02-18', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-02-19', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-02-20', 'All Day', 'School Closed', 'Holiday', false);

-- March 3: PTA Meeting
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('PTA Meeting', 'Monthly PTA meeting to discuss upcoming events and initiatives', '2026-03-03', '5:00 PM', 'School Library', 'Meeting', false);

-- March 14: 9th Annual Adult-Only Dinner & Silent Auction Fundraiser
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('9th Annual Adult-Only Dinner & Silent Auction Fundraiser', 'Annual fundraising event featuring dinner and silent auction. Adults only event that raises critical funds directly benefiting our school.', '2026-03-14', 'TBD', 'TBD', 'Fundraiser', true);

-- March 19: Starstruck Performance
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('Starstruck Performance', 'Starstruck performance at John Barrett Middle School', '2026-03-19', 'TBD', 'John Barrett Middle School', 'Performance', true);

-- March 30 - April 3: No School (create individual events for each day)
INSERT INTO public.events (title, description, date, time, location, category, is_featured) VALUES
  ('No School', 'School holiday - no classes', '2026-03-30', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-03-31', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-04-01', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-04-02', 'All Day', 'School Closed', 'Holiday', false),
  ('No School', 'School holiday - no classes', '2026-04-03', 'All Day', 'School Closed', 'Holiday', false);

