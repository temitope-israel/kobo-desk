import { isDayKey, toDayKey } from '../../lib/dates';
import { CURRENCIES, PAYMENT_STATUSES } from '../../types/payment';
import type { Currency, PaymentStatus, Transaction } from '../../types/payment';
import { searchTransactions } from './search';

export const SORT_FIELDS = ['createdAt', 'amount', 'customer', 'status', 'reference'] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortDirection = 'asc' | 'desc';

export const PAGE_SIZES = [10, 25, 50];

export type TransactionFilters = {
  search: string;
  status: PaymentStatus | 'all';
  currency: Currency | 'all';
  /** A day key like '2026-10-01', or '' for no start date */
  from: string;
  /** A day key like '2026-10-09', or '' for no end date */
  to: string;
  sort: SortField;
  dir: SortDirection;
  page: number;
  pageSize: number;
};

export const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  status: 'all',
  currency: 'all',
  from: '',
  to: '',
  sort: 'createdAt',
  dir: 'desc',
  page: 1,
  pageSize: 10,
};

export function isStatus(value: string | null): value is PaymentStatus {
  return PAYMENT_STATUSES.some((status) => status === value);
}

export function isCurrency(value: string | null): value is Currency {
  return CURRENCIES.some((currency) => currency === value);
}

function isSortField(value: string | null): value is SortField {
  return SORT_FIELDS.some((field) => field === value);
}

/** Read the URL's search parameters into a safe, typed filters object. */
export function parseFilters(params: URLSearchParams): TransactionFilters {
  const status = params.get('status');
  const currency = params.get('currency');
  const sort = params.get('sort');
  const dir = params.get('dir');
  const from = params.get('from');
  const to = params.get('to');
  const page = Number(params.get('page'));
  const size = Number(params.get('size'));

  const safeCurrency = isCurrency(currency) ? currency : DEFAULT_FILTERS.currency;
  const safeSort = isSortField(sort) ? sort : DEFAULT_FILTERS.sort;

  return {
    search: params.get('q') ?? DEFAULT_FILTERS.search,
    status: isStatus(status) ? status : DEFAULT_FILTERS.status,
    currency: safeCurrency,
    from: isDayKey(from) ? from : DEFAULT_FILTERS.from,
    to: isDayKey(to) ? to : DEFAULT_FILTERS.to,
    // Amounts in different currencies cannot be compared, so sorting by amount needs a currency.
    sort: safeSort === 'amount' && safeCurrency === 'all' ? DEFAULT_FILTERS.sort : safeSort,
    dir: dir === 'asc' || dir === 'desc' ? dir : DEFAULT_FILTERS.dir,
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_FILTERS.page,
    pageSize: PAGE_SIZES.includes(size) ? size : DEFAULT_FILTERS.pageSize,
  };
}

/**
 * Write filters into a copy of the given parameters. Values equal to the
 * default are left out, and parameters we do not own (like tx) are kept.
 */
export function writeFilters(base: URLSearchParams, filters: TransactionFilters): URLSearchParams {
  const next = new URLSearchParams(base);

  function write(key: string, value: string, defaultValue: string) {
    if (value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }

  write('q', filters.search, DEFAULT_FILTERS.search);
  write('status', filters.status, DEFAULT_FILTERS.status);
  write('currency', filters.currency, DEFAULT_FILTERS.currency);
  write('from', filters.from, DEFAULT_FILTERS.from);
  write('to', filters.to, DEFAULT_FILTERS.to);
  write('sort', filters.sort, DEFAULT_FILTERS.sort);
  write('dir', filters.dir, DEFAULT_FILTERS.dir);
  write('page', String(filters.page), String(DEFAULT_FILTERS.page));
  write('size', String(filters.pageSize), String(DEFAULT_FILTERS.pageSize));

  return next;
}

/** Is the user narrowing the list down? (Sort and page do not count.) */
export function hasActiveFilters(filters: TransactionFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.currency !== 'all' ||
    filters.from !== '' ||
    filters.to !== ''
  );
}

const compare: Record<SortField, (a: Transaction, b: Transaction) => number> = {
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
  amount: (a, b) => a.amount - b.amount,
  customer: (a, b) => a.customer.name.localeCompare(b.customer.name),
  status: (a, b) => a.status.localeCompare(b.status),
  reference: (a, b) => a.reference.localeCompare(b.reference),
};

export function sortTransactions(
  transactions: Transaction[],
  sort: SortField,
  dir: SortDirection,
): Transaction[] {
  const direction = dir === 'asc' ? 1 : -1;

  return [...transactions].sort(
    (a, b) =>
      compare[sort](a, b) * direction ||
      b.createdAt.localeCompare(a.createdAt) ||
      a.id.localeCompare(b.id),
  );
}

export function applyFilters(
  transactions: Transaction[],
  filters: TransactionFilters,
  timeZone: string,
): Transaction[] {
  const matching = searchTransactions(transactions, filters.search).filter((transaction) => {
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    if (filters.currency !== 'all' && transaction.currency !== filters.currency) return false;

    if (filters.from !== '' || filters.to !== '') {
      const day = toDayKey(transaction.createdAt, timeZone);
      if (filters.from !== '' && day < filters.from) return false;
      if (filters.to !== '' && day > filters.to) return false;
    }

    return true;
  });

  return sortTransactions(matching, filters.sort, filters.dir);
}

export const DEFAULT_DIRECTION: Record<SortField, SortDirection> = {
  createdAt: 'desc',
  amount: 'desc',
  customer: 'asc',
  status: 'asc',
  reference: 'asc',
};

/** What should clicking a column header do? */
export function nextSort(
  current: { sort: SortField; dir: SortDirection },
  field: SortField,
): { sort: SortField; dir: SortDirection } {
  if (current.sort === field) {
    return { sort: field, dir: current.dir === 'asc' ? 'desc' : 'asc' };
  }
  return { sort: field, dir: DEFAULT_DIRECTION[field] };
}
