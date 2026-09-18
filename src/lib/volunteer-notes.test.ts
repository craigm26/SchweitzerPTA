import { describe, it, expect } from 'vitest';
import {
  DEFAULT_VOLUNTEER_NOTES_LABEL,
  normalizeVolunteerNotes,
  volunteerNotesLabel,
} from './volunteer-notes';

describe('volunteerNotesLabel', () => {
  it('falls back to the default wording when no label is set', () => {
    expect(volunteerNotesLabel(null)).toBe(DEFAULT_VOLUNTEER_NOTES_LABEL);
    expect(volunteerNotesLabel(undefined)).toBe(DEFAULT_VOLUNTEER_NOTES_LABEL);
    expect(volunteerNotesLabel('   ')).toBe(DEFAULT_VOLUNTEER_NOTES_LABEL);
  });

  it('uses the admin wording when one is set', () => {
    expect(volunteerNotesLabel('  Which game would you like?  ')).toBe('Which game would you like?');
  });
});

describe('normalizeVolunteerNotes', () => {
  it('stores nothing for a shift that is not asking for notes', () => {
    expect(normalizeVolunteerNotes('Ring toss please', false)).toBeNull();
  });

  it('trims a real answer', () => {
    expect(normalizeVolunteerNotes('  Paired with Jen  ', true)).toBe('Paired with Jen');
  });

  it('treats blank and non-string input as no answer', () => {
    expect(normalizeVolunteerNotes('   ', true)).toBeNull();
    expect(normalizeVolunteerNotes('', true)).toBeNull();
    expect(normalizeVolunteerNotes(undefined, true)).toBeNull();
    expect(normalizeVolunteerNotes(null, true)).toBeNull();
    expect(normalizeVolunteerNotes(42, true)).toBeNull();
    expect(normalizeVolunteerNotes({ notes: 'x' }, true)).toBeNull();
  });
});
