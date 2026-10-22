import { describe, expect, it } from 'vitest';
import type { Transaction } from '../../types/payment';
import { searchTransactions } from './search';

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

const list = [
  makeTransaction({ id: 'a', reference: 'KD-000010' }),
  makeTransaction({
    id: 'b',
    reference: 'KD-000020',
    customer: { id: 'cus_2', name: 'Chinedu Eze', email: 'chinedu@example.com' },
  }),
  makeTransaction({
    id: 'c',
    reference: 'KD-000030',
    customer: { id: 'cus_3', name: 'Funke Bello', email: 'funke.bello@gmail.test' },
  }),
];

describe('searchTransactions', () => {
  it('returns everything for an empty or blank query', () => {
    expect(searchTransactions(list, '')).toEqual(list);
    expect(searchTransactions(list, ' ')).toEqual(list);
  });

  it('finds by reference', () => {
    expect(searchTransactions(list, 'KD-000020').map((t) => t.id)).toEqual(['b']);
  });

  it('finds by part of a customer name, ignoring case', () => {
    expect(searchTransactions(list, 'chin').map((t) => t.id)).toEqual(['b']);
    expect(searchTransactions(list, 'FUNKE').map((t) => t.id)).toEqual(['c']);
  });

  it('finds by email', () => {
    expect(searchTransactions(list, 'mail.test').map((t) => t.id)).toEqual(['c']);
  });

  it('ignores spaces around the query', () => {
    expect(searchTransactions(list, '  eze   ').map((t) => t.id)).toEqual(['b']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(searchTransactions(list, 'zzz')).toEqual([]);
  });

  it('does not change the original list', () => {
    const before = list.map((t) => t.id);
    searchTransactions(list, 'ada');
    expect(list.map((t) => t.id)).toEqual(before);
  });
});
