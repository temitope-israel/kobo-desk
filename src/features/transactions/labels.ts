import type { PaymentMethod, PaymentStatus } from '../../types/payment';

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  successful: 'Successful',
  failed: 'Failed',
  pending: 'Pending',
  refunded: 'Refunded',
};

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Card',
  bank_transfer: 'Bank transfer',
  ussd: 'USSD',
};
