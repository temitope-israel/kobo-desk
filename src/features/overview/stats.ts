import type { Currency, Transaction } from '../../types/payment';

const DAY_MS = 24 * 60 * 60 * 1000;

export type OverviewStats = {
  /** Mnior Units */
  revenue: number;
  successfulCount: number;
  failedCount: number;
  /** A fraction from 0 to 1, or null when no payments have finished */
  successRate: number | null;
};

export type DailyRevenue = {
  /** A day like '2026-10-06 */
  date: string;
  /** Minor units */
  revenue: number;
};

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
/** Which calendar day is this moment, for someone in this time zone? */
export function toDayKey(time: number | string, timeZone: string): string {
  const parts = getDayFormatter(timeZone).formatToParts(new Date(time));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** The last N calendar days, oldest first, ending today. */
export function getPeriodDays(days: number, now: number, timeZone: string): string[] {
  return Array.from({ length: days }, (_, index) =>
    toDayKey(now - (days - 1 - index) * DAY_MS, timeZone),
  );
}

type FilterOptions = {
  currency: Currency;
  days: number;
  now: number;
  timeZone: string;
};

/** Keep transactions in one currency that fall insdie the last N calendar days. */
export function filterTransactions(
  transactions: Transaction[],
  { currency, days, now, timeZone }: FilterOptions,
): Transaction[] {
  const periodDays = new Set(getPeriodDays(days, now, timeZone));
  return transactions.filter(
    (transaction) =>
      transaction.currency === currency &&
      periodDays.has(toDayKey(transaction.createdAt, timeZone)),
  );
}

export function calculateStats(transactions: Transaction[]): OverviewStats {
  let revenue = 0;
  let successfulCount = 0;
  let failedCount = 0;

  for (const transaction of transactions) {
    if (transaction.status === 'successful') {
      revenue += transaction.amount;
      successfulCount += 1;
    } else if (transaction.status === 'failed') {
      failedCount += 1;
    }
  }
  const finished = successfulCount + failedCount;

  return {
    revenue,
    successfulCount,
    failedCount,
    successRate: finished === 0 ? null : successfulCount / finished,
  };
}

/** Revenue for each of the last N days, including days with no sale. */
export function getDailyRevenue(
  transactions: Transaction[],
  days: number,
  now: number,
  timeZone: string,
): DailyRevenue[] {
  const revenueByDay = transactions.reduce<Record<string, number>>((totals, transaction) => {
    if (transaction.status !== 'successful') return totals;

    const day = toDayKey(transaction.createdAt, timeZone);
    totals[day] = (totals[day] ?? 0) + transaction.amount;
    return totals;
  }, {});
  return getPeriodDays(days, now, timeZone).map((date) => ({
    date,
    revenue: revenueByDay[date] ?? 0,
  }));
}

/** The newest transactions first. Does not change the list it is given. */
export function getRecentTransactions(transactions: Transaction[], count: number): Transaction[] {
  return [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, count);
}
