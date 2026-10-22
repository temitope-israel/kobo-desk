import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { formatDateTime } from '../../lib/format';
import { formatMoney } from '../../lib/money';
import type { Transaction } from '../../types/payment';

type RecentTransactionsProps = {
  transactions: Transaction[];
  timeZone: string;
};

export function RecentTransactions({ transactions, timeZone }: RecentTransactionsProps) {
  return (
    <Card heading="Recent transactions">
      <ul className="divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {transaction.customer.name}
              </p>
              <p className="text-xs text-slate-500">
                <span className="font-mono">{transaction.reference}</span> ·{' '}
                {formatDateTime(transaction.createdAt, timeZone)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-900">
                {formatMoney(transaction.amount, transaction.currency)}
              </span>
              <Badge status={transaction.status} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
