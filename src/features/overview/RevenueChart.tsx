import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompactNumber, formatDay } from '../../lib/format';
import { formatMoney, toMajor } from '../../lib/money';
import type { Currency } from '../../types/payment';
import type { DailyRevenue } from './stats';

type RevenueChartProps = {
  data: DailyRevenue[];
  currency: Currency;
};

export function RevenueChart({ data, currency }: RevenueChartProps) {
  return (
    <div
      role="img"
      aria-label={`Line chart of daily revenue in ${currency} for the last ${data.length} days`}
      className="h-72 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDay} minTickGap={24} tickMargin={8} />
          <YAxis
            width={56}
            tickFormatter={(minor: number) => formatCompactNumber(toMajor(minor))}
          />
          <Tooltip
            labelFormatter={(label) => formatDay(String(label))}
            formatter={(value) => [formatMoney(Number(value), currency), 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-brand-600)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
