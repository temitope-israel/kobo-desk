import { Badge } from '../../components/Badge';
import { formatDateTime } from '../../lib/format';
import { formatMoney } from '../../lib/money';
import type { Transaction } from '../../types/payment';
import type { SortDirection, SortField } from './filters';
import { SortableHeader } from './SortableHeader';

type TransactionsTableProps = {
  transactions: Transaction[];
  timeZone: string;
  sort: SortField;
  dir: SortDirection;
  canSortByAmount: boolean;
  onSort: (field: SortField) => void;
  onSelect: (id: string) => void;
};

export function TransactionsTable({
  transactions,
  timeZone,
  sort,
  dir,
  canSortByAmount,
  onSort,
  onSelect,
}: TransactionsTableProps) {
  const header = { activeField: sort, direction: dir, onSort };

  return (
    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">Transactions</caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <SortableHeader label="Reference" field="reference" {...header} />
            <SortableHeader label="Customer" field="customer" {...header} />
            <SortableHeader
              label="Amount"
              field="amount"
              align="right"
              disabled={!canSortByAmount}
              {...header}
            />
            <th scope="col" className="px-4 py-3 font-semibold">
              Currency
            </th>
            <SortableHeader label="Status" field="status" {...header} />
            <SortableHeader label="Date" field="createdAt" {...header} />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              onClick={() => onSelect(transaction.id)}
              className="cursor-pointer hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(transaction.id);
                  }}
                  aria-label={`View details for ${transaction.reference}`}
                  className="rounded font-mono text-xs text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {transaction.reference}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{transaction.customer.name}</div>
                <div className="text-xs text-slate-500">{transaction.customer.email}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                {formatMoney(transaction.amount, transaction.currency)}
              </td>
              <td className="px-4 py-3 text-slate-600">{transaction.currency}</td>
              <td className="px-4 py-3">
                <Badge status={transaction.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {formatDateTime(transaction.createdAt, timeZone)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
