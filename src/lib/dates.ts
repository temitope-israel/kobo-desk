export const DAY_MS = 24 * 60 * 60 * 1000;

export function getLocalTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const dayFormatters = new Map<string, Intl.DateTimeFormat>();

function getDayFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = dayFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    dayFormatters.set(timeZone, formatter);
  }
  return formatter;
}

/** Which calendar key is this moment,for someone in this time zone? */
export function toDayKey(time: number | string, timeZone: string): string {
  const parts = getDayFormatter(timeZone).formatToParts(new Date(time));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** the last N calendar days, oldest first, ending today. */
export function getPeriodDays(days: number, now: number, timeZone: string): string[] {
  return Array.from({ length: days }, (_, index) =>
    toDayKey(now - (days - 1 - index) * DAY_MS, timeZone),
  );
}

/** Is this text a real dalendar day written as YYYY-MM-DD */
export function isDayKey(value: string | null): value is string {
  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
