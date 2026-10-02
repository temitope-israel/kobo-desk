import clsx from 'clsx';
import type { PaymentStatus } from '../types/payment';

const statusClasses: Record<PaymentStatus, string> = {
  successful: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-amber-100 text-amber-800',
  refunded: 'bg-slate-200 text-slate-700',
};

type BadgeProps = {
  status: PaymentStatus;
};

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
