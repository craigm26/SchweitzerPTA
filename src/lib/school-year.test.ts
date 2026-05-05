import { describe, it, expect } from 'vitest';
import { schoolYearFromDate, isValidSchoolYear } from './school-year';

describe('schoolYearFromDate', () => {
  it('returns YYYY-YYYY+1 on Aug 1', () => {
    expect(schoolYearFromDate(new Date(2025, 7, 1))).toBe('2025-2026');
  });

  it('uses prior school year for July 31', () => {
    expect(schoolYearFromDate(new Date(2025, 6, 31))).toBe('2024-2025');
  });

  it('uses prior school year for January', () => {
    expect(schoolYearFromDate(new Date(2026, 0, 15))).toBe('2025-2026');
  });

  it('uses new school year for December', () => {
    expect(schoolYearFromDate(new Date(2025, 11, 20))).toBe('2025-2026');
  });
});

describe('isValidSchoolYear', () => {
  it('accepts consecutive years', () => {
    expect(isValidSchoolYear('2025-2026')).toBe(true);
  });

  it('rejects non-consecutive years', () => {
    expect(isValidSchoolYear('2025-2027')).toBe(false);
  });

  it('rejects bad format', () => {
    expect(isValidSchoolYear('25-26')).toBe(false);
    expect(isValidSchoolYear('2025/2026')).toBe(false);
    expect(isValidSchoolYear('')).toBe(false);
  });
});
