import { Badge } from '../../components/Badge';
import { DescriptionList } from '../../components/DescriptionList';
import { ErrorMessage } from '../../components/ErrorMessage';
import { SkeletonRows } from '../../components/Skeleton';
import { getErrorMessage } from '../../lib/errors';
import { formatDateTime } from '../../lib/format';
import { formatMoney } from '../../lib/money';
import type { Transaction } from '../../types/payment';
import { EventTimeline } from './EventTimeline';
import { METHOD_LABELS } from './labels';
import { useTransactionDetail } from './useTransactions';

type TransactionDetailPanelProps = {
  transaction: Transaction;
  timeZone: string;
};

export function TransactionDetailPanel({ transaction, timeZone }: TransactionDetailPanelProps) {
  const { data, isPending, isError, error, isFetching, refetch } = useTransactionDetail(
    transaction.id,
  );

  const items = [
    {
      label: 'Reference',
      value: <span className="font-mono text-xs">{transaction.reference}</span>,
    },
    { label: 'Customer', value: transaction.customer.name },
    { label: 'Email', value: transaction.customer.email },
    { label: 'Payment method', value: data?.methodDetail ?? METHOD_LABELS[transaction.method] },
    { label: 'Currency', value: transaction.currency },
    { label: 'Created', value: formatDateTime(transaction.createdAt, timeZone) },
    ...(data?.failureReason ? [{ label: 'Failure reason', value: data.failureReason }] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-3xl font-bold tabular-nums text-slate-900">
          {formatMoney(transaction.amount, transaction.currency)}
        </p>
        <div className="mt-2">
          <Badge status={transaction.status} />
        </div>
      </div>

      <DescriptionList items={items} />

      <section aria-labelledby="timeline-heading">
        <h3 id="timeline-heading" className="mb-3 text-sm font-semibold text-slate-900">
          Timeline
        </h3>

        {isPending && <SkeletonRows rows={3} />}

        {isError && (
          <ErrorMessage
            title="Could not load the timeline"
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        )}

        {data && <EventTimeline events={data.events} timeZone={timeZone} />}
      </section>
    </div>
  );
}
