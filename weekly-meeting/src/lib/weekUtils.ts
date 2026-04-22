/**
 * Returns ISO week key "YYYY-WW" for a given date.
 * Monday is the start of the week (ISO 8601).
 */
export function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // treat Sunday as 7
  d.setUTCDate(d.getUTCDate() + 4 - day); // nearest Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const year = d.getUTCFullYear();
  return `${year}-${String(weekNo).padStart(2, "0")}`;
}

/**
 * Given a week key "YYYY-WW", returns the Monday of that week.
 */
export function getMondayOfWeek(weekKey: string): Date {
  const [year, week] = weekKey.split("-").map(Number);
  const jan4 = new Date(Date.UTC(year, 0, 4)); // Jan 4 is always in week 1
  const jan4Day = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1) + (week - 1) * 7);
  return monday;
}

/**
 * Returns a Korean date range label for a week key.
 * e.g. "2026년 4월 20일 ~ 26일"
 */
export function getWeekLabel(weekKey: string): string {
  const monday = getMondayOfWeek(weekKey);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const year = monday.getUTCFullYear();
  const startMonth = monday.getUTCMonth() + 1;
  const startDay = monday.getUTCDate();
  const endMonth = sunday.getUTCMonth() + 1;
  const endDay = sunday.getUTCDate();

  if (startMonth === endMonth) {
    return `${year}년 ${startMonth}월 ${startDay}일 ~ ${endDay}일`;
  }
  return `${year}년 ${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
}

export function addWeeks(weekKey: string, delta: number): string {
  const monday = getMondayOfWeek(weekKey);
  monday.setUTCDate(monday.getUTCDate() + delta * 7);
  return getWeekKey(monday);
}
