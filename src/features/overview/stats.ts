import { getPeriodDays, toDayKey } from '../../lib/dates';
import type { Currency, Transaction } from '../../types/payment';

export type OverviewStats = {
  /** Minor units */
  revenue: number;
  successfulCount: number;
  failedCount: number;
  /** A fraction from 0 to 1, or null when no payments have finished */
  successRate: number | null;
};

export type DailyRevenue = {
  /** A day key like '2026-10-06' */
  date: string;
  /** Minor units */
  revenue: number;
};

type FilterOptions = {
  currency: Currency;
  days: number;
  now: number;
  timeZone: string;
};

/** Keep transactions in one currency that fall inside the last N calendar days. */
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

/** Revenue for each of the last N days, including days with no sales. */
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
