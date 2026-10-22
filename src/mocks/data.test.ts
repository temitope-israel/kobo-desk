import { describe, expect, it } from 'vitest';
import { customers, disputes, getTransactionDetail, refunds, transactions } from './data';

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

describe('getTransactionDetail', () => {
  it('returns undefined for an unknown id', () => {
    expect(getTransactionDetail('txn_does_not_exist')).toBeUndefined();
  });

  it('keeps the original transaction fields', () => {
    const original = transactions[0];
    expect(getTransactionDetail(original.id)).toMatchObject({
      id: original.id,
      reference: original.reference,
      amount: original.amount,
      status: original.status,
    });
  });

  it('starts with an initiated event and lists events in time order', () => {
    for (const transaction of transactions) {
      const events = getTransactionDetail(transaction.id)!.events;
      const times = events.map((event) => event.at);

      expect(events[0].type).toBe('initiated');
      expect(times).toEqual([...times].sort());
    }
  });

  it('gives a failure reason to failed payments only', () => {
    for (const transaction of transactions) {
      const detail = getTransactionDetail(transaction.id)!;
      expect(detail.failureReason !== undefined).toBe(transaction.status === 'failed');
    }
  });

  it('ends the story of a refunded payment with a refund event', () => {
    const refunded = transactions.find((transaction) => transaction.status === 'refunded')!;
    const events = getTransactionDetail(refunded.id)!.events;
    expect(events[events.length - 1].type).toBe('refunded');
  });

  it('gives the same detail every time', () => {
    const id = transactions[5].id;
    expect(getTransactionDetail(id)).toEqual(getTransactionDetail(id));
  });
});
