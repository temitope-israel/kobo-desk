export type Currency = 'NGN' | 'GHS' | 'KES' | 'USD';

export type PaymentStatus = 'successful' | 'failed' | 'pending' | 'refunded';

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd';

export type Customer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  reference: string;
  /** Amount in minor units (kobo, pesewas, cents). 150000 means 1, 500.00 */
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  method: PaymentMethod;
  customer: Pick<Customer, 'id' | 'name' | 'email'>;
  createdAt: string;
};

export type SettlementStatus = 'processed' | 'pending' | 'failed';

export type Settlement = {
  id: string;
  reference: string;
  /** Minor units */
  amount: number;
  currency: Currency;
  status: SettlementStatus;
  bankName: string;
  createdAt: string;
};

export type RefundStatus = 'completed' | 'pending' | 'failed';

export type Refund = {
  id: string;
  transactionId: string;
  /** Minor Units */
  amount: number;
  currency: Currency;
  status: RefundStatus;
  reason: string;
  createdAt: string;
};

export type DisputeStatus = 'open' | 'won' | 'lost';

export type Dispute = {
  id: string;
  transactionId: string;
  /** Minor units */
  amount: number;
  currency: Currency;
  status: DisputeStatus;
  reason: string;
  /** The last moment the merchant can respond */
  dueAt: string;
  createdAt: string;
};
