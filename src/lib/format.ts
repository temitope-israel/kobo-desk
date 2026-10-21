export function formatPercent(fraction: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(fraction);
}

/** 1500000 -> '1.5M' (used on chart axes, where space is tight) */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/** '2026-10-06' -> 'Oct 6' */
export function formatDay(dayKey: string): string {
  return new Intl.DateTimeFormat('en-NG', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${dayKey}T12:00:00Z`),
  );
}

/** An ISO date string -> '6 Oct, 09:41' in the given time zone */
export function formatDateTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(new Date(iso));
}