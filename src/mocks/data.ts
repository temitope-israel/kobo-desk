import { toMinor } from '../lib/money';
import type {
  Currency,
  Customer,
  Dispute,
  DisputeStatus,
  PaymentMethod,
  PaymentStatus,
  Refund,
  Settlement,
  SettlementStatus,
  Transaction,
} from '../types/payment';
import { createRandom } from './random';

const random = createRandom(2026);

const DAY_MS = 24 * 60 * 60 * 1000;
const TRANSACTION_COUNT = 200;
const TRANSACTION_SPAN_DAYS = 60;

const FIRST_NAMES = [
  'Ada',
  'Chinedu',
  'Funke',
  'Ibrahim',
  'Ngozi',
  'Tunde',
  'Amara',
  'Kofi',
  'Esi',
  'Wanjiru',
  'Kevin',
  'Zainab',
  'Emeka',
  'Sade',
  'Yaw',
] as const;
const LAST_NAMES = [
  'Okafor',
  'Adeyemi',
  'Bello',
  'Mensah',
  'Kamau',
  'Nwosu',
  'Balogun',
  'Owusu',
  'Otieno',
  'Eze',
  'Abubakar',
  'Boateng',
] as const;
const BANKS = [
  'Access Bank',
  'GTBank',
  'Zenith Bank',
  'First Bank',
  'UBA',
  'Stanbic IBTC',
] as const;
const DISPUTE_REASONS = [
  'Customer says they did not authorise this payment',
  'Goods or service not received',
  'Duplicate charge',
  'Amount charged is incorrect',
] as const;
const REFUND_REASONS = [
  'Customer requested a refund',
  'Order cancelled',
  'Item returned',
  'Duplicate payment',
] as const;

const AMOUNT_RANGE: Record<Currency, { min: number; max: number }> = {
  NGN: { min: 1000, max: 500000 },
  GHS: { min: 20, max: 5000 },
  KES: { min: 100, max: 50000 },
  USD: { min: 5, max: 1000 },
};

type Option<T> = { value: T; weight: number };

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function int(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/** Pick one value; a bigger weight makes it more likely. */
function pickWeighted<T>(options: Option<T>[]): T {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = random() * total;
  for (const option of options) {
    roll -= option.weight;
    if (roll < 0) return option.value;
  }
  return options[options.length - 1].value;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

export const customers: Customer[] = Array.from({ length: 30 }, (_, index) => {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return {
    id: `cus_${index + 1}`,
    name: `${first} ${last}`,
    email: `${first}.${last}${index + 1}@example.com`.toLowerCase(),
    createdAt: daysAgo(int(60, 180)),
  };
});

export const transactions: Transaction[] = Array.from({ length: TRANSACTION_COUNT }, (_, index) => {
  const customer = pick(customers);
  const currency = pickWeighted<Currency>([
    { value: 'NGN', weight: 60 },
    { value: 'USD', weight: 15 },
    { value: 'GHS', weight: 15 },
    { value: 'KES', weight: 10 },
  ]);
  const { min, max } = AMOUNT_RANGE[currency];

  return {
    id: `txn_${index + 1}`,
    reference: `KD-${String(TRANSACTION_COUNT - index).padStart(6, '0')}`,
    amount: toMinor(int(min, max)) + int(0, 99),
    currency,
    status: pickWeighted<PaymentStatus>([
      { value: 'successful', weight: 70 },
      { value: 'failed', weight: 15 },
      { value: 'pending', weight: 10 },
      { value: 'refunded', weight: 5 },
    ]),
    method: pickWeighted<PaymentMethod>([
      { value: 'card', weight: 55 },
      { value: 'bank_transfer', weight: 30 },
      { value: 'ussd', weight: 15 },
    ]),
    customer: { id: customer.id, name: customer.name, email: customer.email },
    createdAt: daysAgo((index / TRANSACTION_COUNT) * TRANSACTION_SPAN_DAYS + random() * 0.25),
  };
});

export const settlements: Settlement[] = Array.from({ length: 12 }, (_, index) => {
  const currency = pickWeighted<Currency>([
    { value: 'NGN', weight: 70 },
    { value: 'USD', weight: 10 },
    { value: 'GHS', weight: 10 },
    { value: 'KES', weight: 10 },
  ]);
  const { min, max } = AMOUNT_RANGE[currency];

  return {
    id: `stl_${index + 1}`,
    reference: `KD-STL-${String(12 - index).padStart(4, '0')}`,
    amount: toMinor(int(min * 20, max * 20)),
    currency,
    status: pickWeighted<SettlementStatus>([
      { value: 'processed', weight: 75 },
      { value: 'pending', weight: 20 },
      { value: 'failed', weight: 5 },
    ]),
    bankName: pick(BANKS),
    createdAt: daysAgo(index * 5 + random() * 2),
  };
});

export const refunds: Refund[] = transactions
  .filter((transaction) => transaction.status === 'refunded')
  .map((transaction, index): Refund => ({
    id: `ref_${index + 1}`,
    transactionId: transaction.id,
    amount: transaction.amount,
    currency: transaction.currency,
    status: 'completed',
    reason: pick(REFUND_REASONS),
    createdAt: transaction.createdAt,
  }));

export const disputes: Dispute[] = transactions
  .filter((transaction) => transaction.status === 'successful')
  .filter((_, index) => index % 12 === 0)
  .map((transaction, index): Dispute => {
    const createdAt = daysAgo(int(1, 10));
    return {
      id: `dsp_${index + 1}`,
      transactionId: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: pickWeighted<DisputeStatus>([
        { value: 'open', weight: 50 },
        { value: 'won', weight: 25 },
        { value: 'lost', weight: 25 },
      ]),
      reason: pick(DISPUTE_REASONS),
      createdAt,
      dueAt: new Date(new Date(createdAt).getTime() + 10 * DAY_MS).toISOString(),
    };
  });
