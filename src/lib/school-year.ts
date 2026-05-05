// US school year boundary: August 1 starts a new academic year.
// A photo taken on/after Aug 1, YYYY belongs to school year YYYY-(YYYY+1);
// before Aug 1 it belongs to (YYYY-1)-YYYY.

const SCHOOL_YEAR_START_MONTH = 7; // 0-indexed: August

export function schoolYearFromDate(date: Date): string {
  const year = date.getFullYear();
  const startYear = date.getMonth() >= SCHOOL_YEAR_START_MONTH ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
}

export function isValidSchoolYear(value: string): boolean {
  const match = /^(\d{4})-(\d{4})$/.exec(value);
  if (!match) return false;
  return Number(match[2]) === Number(match[1]) + 1;
}

export function currentSchoolYear(): string {
  return schoolYearFromDate(new Date());
}
