import { describe, expect, it } from 'vitest';
import type { Transaction } from '../../types/payment';
import {
  applyFilters,
  DEFAULT_FILTERS,
  hasActiveFilters,
  nextSort,
  parseFilters,
  sortTransactions,
  writeFilters,
} from './filters';
import type { TransactionFilters } from './filters';

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'txn_x',
    reference: 'KD-000001',
    amount: 100000,
    currency: 'NGN',
    status: 'successful',
    method: 'card',
    customer: { id: 'cus_1', name: 'Ada Okafor', email: 'ada.okafor@example.com' },
    createdAt: '2026-10-10T09:00:00.000Z',
    ...overrides,
  };
}

const params = (query: string) => new URLSearchParams(query);

describe('parseFilters', () => {
  it('uses the defaults for an empty URL', () => {
    expect(parseFilters(params(''))).toEqual(DEFAULT_FILTERS);
  });

  it('reads valid values', () => {
    const filters = parseFilters(
      params(
        'q=ada&status=failed&currency=USD&from=2026-10-01&to=2026-10-09&sort=amount&dir=asc&page=3&size=25',
      ),
    );
    expect(filters).toEqual({
      search: 'ada',
      status: 'failed',
      currency: 'USD',
      from: '2026-10-01',
      to: '2026-10-09',
      sort: 'amount',
      dir: 'asc',
      page: 3,
      pageSize: 25,
    });
  });

  it('falls back to the defaults for invalid values', () => {
    const filters = parseFilters(
      params(
        'status=hacked&currency=XXX&from=2026-02-31&to=nope&sort=password&dir=sideways&page=-4&size=9999',
      ),
    );
    expect(filters).toEqual(DEFAULT_FILTERS);
  });

  it('only accepts whole, positive page numbers', () => {
    expect(parseFilters(params('page=2.5')).page).toBe(1);
    expect(parseFilters(params('page=abc')).page).toBe(1);
    expect(parseFilters(params('page=0')).page).toBe(1);
    expect(parseFilters(params('page=7')).page).toBe(7);
  });

  it('only allows sorting by amount when a currency is chosen', () => {
    expect(parseFilters(params('sort=amount')).sort).toBe('createdAt');
    expect(parseFilters(params('sort=amount&currency=NGN')).sort).toBe('amount');
  });
});

describe('writeFilters', () => {
  it('writes nothing for the defaults', () => {
    expect(writeFilters(new URLSearchParams(), DEFAULT_FILTERS).toString()).toBe('');
  });

  it('writes only the values that differ from the defaults', () => {
    const next = writeFilters(new URLSearchParams(), {
      ...DEFAULT_FILTERS,
      status: 'failed',
      page: 2,
    });
    expect(next.get('status')).toBe('failed');
    expect(next.get('page')).toBe('2');
    expect(next.has('currency')).toBe(false);
  });

  it('removes a value that goes back to its default', () => {
    const next = writeFilters(new URLSearchParams('status=failed'), DEFAULT_FILTERS);
    expect(next.has('status')).toBe(false);
  });

  it('keeps parameters it does not own, like tx', () => {
    const next = writeFilters(new URLSearchParams('tx=txn_5'), {
      ...DEFAULT_FILTERS,
      status: 'failed',
    });
    expect(next.get('tx')).toBe('txn_5');
  });

  it('round-trips through parseFilters', () => {
    const original: TransactionFilters = {
      search: 'ada',
      status: 'pending',
      currency: 'KES',
      from: '2026-10-01',
      to: '2026-10-05',
      sort: 'amount',
      dir: 'asc',
      page: 2,
      pageSize: 50,
    };
    expect(parseFilters(writeFilters(new URLSearchParams(), original))).toEqual(original);
  });
});

describe('applyFilters and sortTransactions', () => {
  const list = [
    makeTransaction({ id: 'a', amount: 300000, createdAt: '2026-10-10T08:00:00.000Z' }),
    makeTransaction({
      id: 'b',
      status: 'failed',
      amount: 100000,
      createdAt: '2026-10-09T08:00:00.000Z',
      customer: { id: 'cus_2', name: 'Chinedu Eze', email: 'chinedu@example.com' },
    }),
    makeTransaction({
      id: 'c',
      currency: 'USD',
      amount: 5000,
      createdAt: '2026-10-08T23:30:00.000Z',
      customer: { id: 'cus_3', name: 'Funke Bello', email: 'funke@example.com' },
    }),
    makeTransaction({
      id: 'd',
      status: 'pending',
      amount: 200000,
      createdAt: '2026-10-07T08:00:00.000Z',
    }),
  ];

  const ids = (changes: Partial<TransactionFilters>, timeZone = 'UTC') =>
    applyFilters(list, { ...DEFAULT_FILTERS, ...changes }, timeZone).map((t) => t.id);

  it('returns everything, newest first, for the defaults', () => {
    expect(ids({})).toEqual(['a', 'b', 'c', 'd']);
  });

  it('filters by status', () => {
    expect(ids({ status: 'failed' })).toEqual(['b']);
  });

  it('filters by currency', () => {
    expect(ids({ currency: 'USD' })).toEqual(['c']);
  });

  it('includes both ends of a date range', () => {
    expect(ids({ from: '2026-10-09', to: '2026-10-09' })).toEqual(['b']);
  });

  it('uses the time zone to decide which day a payment belongs to', () => {
    // c happened at 23:30 UTC on the 8th, which is already the 9th in Lagos.
    expect(ids({ from: '2026-10-09', to: '2026-10-09' }, 'Africa/Lagos')).toEqual(['b', 'c']);
  });

  it('works with only a start or only an end date', () => {
    expect(ids({ from: '2026-10-09' })).toEqual(['a', 'b']);
    expect(ids({ to: '2026-10-08' })).toEqual(['c', 'd']);
  });

  it('returns nothing when the start date is after the end date', () => {
    expect(ids({ from: '2026-10-10', to: '2026-10-01' })).toEqual([]);
  });

  it('combines search with filters', () => {
    expect(ids({ search: 'ada', status: 'pending' })).toEqual(['d']);
  });

  it('sorts by amount in both directions', () => {
    const naira = list.filter((t) => t.currency === 'NGN');
    expect(sortTransactions(naira, 'amount', 'asc').map((t) => t.id)).toEqual(['b', 'd', 'a']);
    expect(sortTransactions(naira, 'amount', 'desc').map((t) => t.id)).toEqual(['a', 'd', 'b']);
  });

  it('sorts by customer name and breaks ties with the newest first', () => {
    // a and d are both Ada Okafor; a is newer.
    expect(sortTransactions(list, 'customer', 'asc').map((t) => t.id)).toEqual([
      'a',
      'd',
      'b',
      'c',
    ]);
    expect(sortTransactions(list, 'customer', 'desc').map((t) => t.id)).toEqual([
      'c',
      'b',
      'a',
      'd',
    ]);
  });

  it('does not change the original list', () => {
    sortTransactions(list, 'amount', 'asc');
    expect(list.map((t) => t.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('nextSort', () => {
  it('flips the direction when the same column is clicked', () => {
    expect(nextSort({ sort: 'createdAt', dir: 'desc' }, 'createdAt')).toEqual({
      sort: 'createdAt',
      dir: 'asc',
    });
    expect(nextSort({ sort: 'createdAt', dir: 'asc' }, 'createdAt')).toEqual({
      sort: 'createdAt',
      dir: 'desc',
    });
  });

  it('starts a new column in its natural direction', () => {
    expect(nextSort({ sort: 'createdAt', dir: 'desc' }, 'customer')).toEqual({
      sort: 'customer',
      dir: 'asc',
    });
    expect(nextSort({ sort: 'customer', dir: 'asc' }, 'amount')).toEqual({
      sort: 'amount',
      dir: 'desc',
    });
  });
});

describe('hasActiveFilters', () => {
  it('is false for the defaults and for sort, page and page size alone', () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    expect(
      hasActiveFilters({ ...DEFAULT_FILTERS, sort: 'customer', dir: 'asc', page: 3, pageSize: 50 }),
    ).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, search: '   ' })).toBe(false);
  });

  it('is true when any filter is set', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, search: 'ada' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, status: 'failed' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, currency: 'USD' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, from: '2026-10-01' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, to: '2026-10-01' })).toBe(true);
  });
});
