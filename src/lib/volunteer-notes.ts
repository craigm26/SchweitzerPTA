// Shared rules for the optional per-shift "Notes" question on volunteer signups.
// Both signup routes and both pages read these so the wording, the length cap, and the
// "blank means null" rule stay in one place.

export const DEFAULT_VOLUNTEER_NOTES_LABEL =
  'Notes: station preference or person to be paired with (we will do our best to accommodate)';

export const VOLUNTEER_NOTES_MAX_LENGTH = 500;

export function volunteerNotesLabel(label?: string | null): string {
  const trimmed = (label || '').trim();
  return trimmed || DEFAULT_VOLUNTEER_NOTES_LABEL;
}

// Returns the trimmed note, or null for anything blank/absent/non-string. A shift that
// isn't asking for notes always stores null, so turning the question off later can't
// leave an orphaned answer behind.
export function normalizeVolunteerNotes(value: unknown, notesEnabled: boolean): string | null {
  if (!notesEnabled) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}
