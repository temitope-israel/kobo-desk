import { describe, expect, it } from 'vitest';
import { customers, disputes, refunds, transactions } from './data';

describe('fake data', () => {
  it('has 200 transactions with unique ids and references', () => {
    expect(transactions).toHaveLength(200);
    expect(new Set(transactions.map((t) => t.id)).size).toBe(200);
    expect(new Set(transactions.map((t) => t.reference)).size).toBe(200);
  });

  it('stores every amount as a positive whole number of minor units', () => {
    expect(transactions.every((t) => Number.isInteger(t.amount) && t.amount > 0)).toBe(true);
  });

  it('lists the newest transaction first', () => {
    const dates = transactions.map((t) => t.createdAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('only refunds transactions that are marked refunded', () => {
    const refundedIds = new Set(
      transactions.filter((t) => t.status === 'refunded').map((t) => t.id),
    );
    expect(refunds.every((r) => refundedIds.has(r.transactionId))).toBe(true);
  });

  it('links every dispute to an existing transaction', () => {
    const ids = new Set(transactions.map((t) => t.id));
    expect(disputes.every((d) => ids.has(d.transactionId))).toBe(true);
  });

  it('only uses customers that exist', () => {
    const customerIds = new Set(customers.map((c) => c.id));
    expect(transactions.every((t) => customerIds.has(t.customer.id))).toBe(true);
  });
});
