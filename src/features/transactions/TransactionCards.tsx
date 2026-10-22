import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { formatDateTime } from '../../lib/format';
import { formatMoney } from '../../lib/money';
import type { Transaction } from '../../types/payment';

type TransactionCardsProps = {
  transactions: Transaction[];
  timeZone: string;
  onSelect: (id: string) => void;
};

export function TransactionCards({ transactions, timeZone, onSelect }: TransactionCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{transaction.customer.name}</p>
              <p className="font-mono text-xs text-slate-500">{transaction.reference}</p>
            </div>
            <Badge status={transaction.status} />
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-lg font-semibold tabular-nums text-slate-900">
              {formatMoney(transaction.amount, transaction.currency)}
            </p>
            <p className="text-xs text-slate-500">
              {formatDateTime(transaction.createdAt, timeZone)}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full"
            onClick={() => onSelect(transaction.id)}
            aria-label={`View details for ${transaction.reference}`}
          >
            View details
          </Button>
        </li>
      ))}
    </ul>
  );
}
