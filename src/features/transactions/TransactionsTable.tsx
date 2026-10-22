import { Badge } from '../../components/Badge';
import { formatDateTime } from '../../lib/format';
import { formatMoney } from '../../lib/money';
import type { Transaction } from '../../types/payment';

type TransactionsTableProps = {
  transactions: Transaction[];
  timeZone: string;
};

export function TransactionsTable({ transactions, timeZone }: TransactionsTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">Transactions</caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Reference
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Customer
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Currency
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-3 font-mono text-xs text-slate-700">
                {transaction.reference}
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
