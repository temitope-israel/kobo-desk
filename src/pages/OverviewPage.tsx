import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { Skeleton } from '../components/Skeleton';
import { OverviewContent } from '../features/overview/OverviewContent';
import { getLocalTimeZone } from '../features/overview/stats';
import { useTransactions } from '../features/transactions/useTransactions';
import { getErrorMessage } from '../lib/errors';
import type { Currency } from '../types/payment';

type Period = 7 | 30;

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
];

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'NGN', label: 'NGN' },
  { value: 'GHS', label: 'GHS' },
  { value: 'KES', label: 'KES' },
  { value: 'USD', label: 'USD' },
];

function OverviewSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading overview</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-64" />
    </div>
  );
}

export function OverviewPage() {
  const [period, setPeriod] = useState<Period>(30);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [now] = useState(() => Date.now());
  const timeZone = getLocalTimeZone();

  const { data, isPending, isError, isSuccess, error, isFetching, refetch } = useTransactions();

  return (
    <div>
      <PageHeader title="Overview" description="Revenue, success rate and recent activity." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Currency"
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={setCurrency}
        />
        <SegmentedControl
          label="Period"
          options={PERIOD_OPTIONS}
          value={period}
          onChange={setPeriod}
        />
      </div>

      {isPending && <OverviewSkeleton />}

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
          description="When customers pay you, your revenue and recent activity will show up here."
        />
      )}

      {isSuccess && data.length > 0 && (
        <OverviewContent
          transactions={data}
          currency={currency}
          period={period}
          now={now}
          timeZone={timeZone}
        />
      )}
    </div>
  );
}
