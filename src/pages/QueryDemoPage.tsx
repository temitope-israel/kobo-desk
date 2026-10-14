import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { SkeletonRows } from '../components/Skeleton';
import { useTransactions } from '../features/transactions/useTransactions';
import { getErrorMessage } from '../lib/errors';
import { formatMoney } from '../lib/money';

export function QueryDemoPage() {
  const { data, isPending, isError, isSuccess, error, isFetching, refetch } = useTransactions();

  return (
    <div>
      <PageHeader
        title="Transactions (demo)"
        description="A first look at loading, error and empty states."
      />

      <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </Button>

      <div className="mt-6">
        {isPending && <SkeletonRows rows={6} />}

        {isError && (
          <ErrorMessage
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        )}

        {isSuccess && data.length === 0 && (
          <EmptyState
            title="No transactions yet"
            description="When customers pay you, their payments will show up here."
          />
        )}

        {isSuccess && data.length > 0 && (
          <ul className="space-y-2">
            {data.slice(0, 5).map((transaction) => (
              <li key={transaction.id} className="flex items-center gap-3">
                <span className="font-mono text-sm">{transaction.reference}</span>
                <span>{formatMoney(transaction.amount, transaction.currency)}</span>
                <Badge status={transaction.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
