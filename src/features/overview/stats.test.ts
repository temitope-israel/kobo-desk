import { describe, expect, it } from 'vitest';
import type { Transaction } from '../../types/payment';
import {
  calculateStats,
  filterTransactions,
  getDailyRevenue,
  getRecentTransactions,
} from './stats';

const NOW = Date.parse('2026-10-10T12:00:00.000Z');

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'txn_x',
    reference: 'KD-000001',
    amount: 100000,
    currency: 'NGN',
    status: 'successful',
    method: 'card',
    customer: { id: 'cus_1', name: 'Ada Okafor', email: 'ada@example.com' },
    createdAt: '2026-10-10T09:00:00.000Z',
    ...overrides,
  };
}

describe('filterTransactions', () => {
  const options = { currency: 'NGN' as const, days: 7, now: NOW, timeZone: 'UTC' };

  it('keeps transactions inside the period', () => {
    const inside = makeTransaction({ createdAt: '2026-10-04T00:00:00.000Z' }); // first day of the period
    expect(filterTransactions([inside], options)).toHaveLength(1);
  });

  it('drops transactions before the period', () => {
    const outside = makeTransaction({ createdAt: '2026-10-03T23:59:00.000Z' });
    expect(filterTransactions([outside], options)).toHaveLength(0);
  });

  it('drops other currencies', () => {
    const dollars = makeTransaction({ currency: 'USD' });
    expect(filterTransactions([dollars], options)).toHaveLength(0);
  });
});

describe('calculateStats', () => {
  it('adds up revenue from successful payments only', () => {
    const stats = calculateStats([
      makeTransaction({ amount: 100000 }),
      makeTransaction({ amount: 250000 }),
      makeTransaction({ amount: 999999, status: 'failed' }),
      makeTransaction({ amount: 999999, status: 'pending' }),
      makeTransaction({ amount: 999999, status: 'refunded' }),
    ]);
    expect(stats.revenue).toBe(350000);
  });

  it('counts successful and failed payments', () => {
    const stats = calculateStats([
      makeTransaction(),
      makeTransaction(),
      makeTransaction(),
      makeTransaction({ status: 'failed' }),
    ]);
    expect(stats.successfulCount).toBe(3);
    expect(stats.failedCount).toBe(1);
  });

  it('calculates the success rate from finished payments only', () => {
    const stats = calculateStats([
      makeTransaction(),
      makeTransaction(),
      makeTransaction(),
      makeTransaction({ status: 'failed' }),
      makeTransaction({ status: 'pending' }),
    ]);
    expect(stats.successRate).toBe(0.75);
  });

  it('has no success rate when nothing has finished', () => {
    expect(calculateStats([]).successRate).toBeNull();
    expect(calculateStats([makeTransaction({ status: 'pending' })]).successRate).toBeNull();
  });
});

describe('getDailyRevenue', () => {
  const transactions = [
    makeTransaction({ amount: 100000, createdAt: '2026-10-10T08:00:00.000Z' }),
    makeTransaction({ amount: 50000, createdAt: '2026-10-10T20:00:00.000Z' }),
    makeTransaction({ amount: 70000, createdAt: '2026-10-08T10:00:00.000Z' }),
    makeTransaction({ amount: 90000, status: 'failed', createdAt: '2026-10-09T10:00:00.000Z' }),
  ];

  it('adds up successful revenue per day', () => {
    const result = getDailyRevenue(transactions, 3, NOW, 'UTC');
    expect(result).toEqual([
      { date: '2026-10-08', revenue: 70000 },
      { date: '2026-10-09', revenue: 0 },
      { date: '2026-10-10', revenue: 150000 },
    ]);
  });

  it('includes days with no sales as zero', () => {
    const result = getDailyRevenue([], 5, NOW, 'UTC');
    expect(result).toHaveLength(5);
    expect(result.every((day) => day.revenue === 0)).toBe(true);
  });

  it('agrees with the stat card total', () => {
    const daily = getDailyRevenue(transactions, 3, NOW, 'UTC');
    const chartTotal = daily.reduce((sum, day) => sum + day.revenue, 0);
    expect(chartTotal).toBe(calculateStats(transactions).revenue);
  });
});

describe('getRecentTransactions', () => {
  const list = [
    makeTransaction({ id: 'a', createdAt: '2026-10-08T10:00:00.000Z' }),
    makeTransaction({ id: 'c', createdAt: '2026-10-10T10:00:00.000Z' }),
    makeTransaction({ id: 'b', createdAt: '2026-10-09T10:00:00.000Z' }),
  ];

  it('returns the newest first, limited to the count', () => {
    expect(getRecentTransactions(list, 2).map((t) => t.id)).toEqual(['c', 'b']);
  });

  it('does not change the original list', () => {
    getRecentTransactions(list, 2);
    expect(list.map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });
});
