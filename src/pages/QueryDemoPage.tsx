import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { useTransactions } from '../features/transactions/useTransactions';
import { formatMoney } from '../lib/money';

export function QueryDemoPage() {
  const { data, isPending, isError, error, isFetching, refetch } = useTransactions();

  if (isPending) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-600"> Error: {error.message}</p>;

  return (
    <div className="p-6">
      <PageHeader title="Query demo" description={`${data.length} transactions loaded`} />
      <Button onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </Button>

      <ul className="mt-4 space-y-2">
        {data.slice(0, 5).map((transaction) => (
          <li key={transaction.id} className="flex items-center gap-3">
            <span className="font-mono text-sm">{transaction.reference}</span>
            <span>{formatMoney(transaction.amount, transaction.currency)}</span>
            <Badge status={transaction.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
