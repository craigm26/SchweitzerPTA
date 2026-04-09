-- Migration: Rename events table to calendar_events
-- This separates calendar entries from the new events page entries

-- Rename the table
ALTER TABLE public.events RENAME TO calendar_events;

-- Rename the trigger
ALTER TRIGGER update_events_updated_at ON public.calendar_events RENAME TO update_calendar_events_updated_at;

-- Update the foreign key reference in volunteer_signups
-- (volunteer_signups.event_id references events.id)
-- The FK constraint itself doesn't need renaming but the referenced table name changes automatically

-- RLS policies are automatically associated with the renamed table, no changes needed
