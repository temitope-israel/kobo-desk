import { Card } from '../../components/Card';
import { formatPercent } from '../../lib/format';
import { formatMoney } from '../../lib/money';
import type { Currency, Transaction } from '../../types/payment';
import { RecentTransactions } from './RecentTransactions';
import { RevenueChart } from './RevenueChart';
import { StatCard } from './StatCard';
import {
  calculateStats,
  filterTransactions,
  getDailyRevenue,
  getRecentTransactions,
} from './stats';

type OverviewContentProps = {
  transactions: Transaction[];
  currency: Currency;
  period: number;
  now: number;
  timeZone: string;
};

export function OverviewContent({
  transactions,
  currency,
  period,
  now,
  timeZone,
}: OverviewContentProps) {
  const inPeriod = filterTransactions(transactions, { currency, days: period, now, timeZone });
  const stats = calculateStats(inPeriod);
  const daily = getDailyRevenue(inPeriod, period, now, timeZone);
  const recent = getRecentTransactions(transactions, 8);
  const periodLabel = `Last ${period} days`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatMoney(stats.revenue, currency)} hint={periodLabel} />
        <StatCard
          label="Successful payments"
          value={String(stats.successfulCount)}
          hint={periodLabel}
        />
        <StatCard label="Failed payments" value={String(stats.failedCount)} hint={periodLabel} />
        <StatCard
          label="Success rate"
          value={stats.successRate === null ? '-' : formatPercent(stats.successRate)}
          hint="Successful out of finished payments"
        />
      </div>

      <Card heading={`Revenue, ${periodLabel.toLowerCase()} (${currency})`}>
        {stats.successfulCount === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            No successful {currency} payments in the last {period} days.
          </p>
        ) : (
          <RevenueChart data={daily} currency={currency} />
        )}
      </Card>

      <RecentTransactions transactions={recent} timeZone={timeZone} />
    </div>
  );
}
