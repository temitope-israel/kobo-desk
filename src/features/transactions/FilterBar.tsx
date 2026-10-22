import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { SearchBox } from '../../components/SearchBox';
import { Select } from '../../components/Select';
import { CURRENCIES, PAYMENT_STATUSES } from '../../types/payment';
import { DEFAULT_DIRECTION, isCurrency, isStatus, SORT_FIELDS } from './filters';
import type { SortDirection, SortField, TransactionFilters } from './filters';
import { STATUS_LABELS } from './labels';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...PAYMENT_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
];

const CURRENCY_OPTIONS = [
  { value: 'all', label: 'All currencies' },
  ...CURRENCIES.map((currency) => ({ value: currency, label: currency })),
];

const SORT_LABELS: Record<SortField, Record<SortDirection, string>> = {
  createdAt: { desc: 'Date: newest first', asc: 'Date: oldest first' },
  amount: { desc: 'Amount: high to low', asc: 'Amount: low to high' },
  customer: { asc: 'Customer: A to Z', desc: 'Customer: Z to A' },
  status: { asc: 'Status: A to Z', desc: 'Status: Z to A' },
  reference: { asc: 'Reference: A to Z', desc: 'Reference: Z to A' },
};

const SORT_OPTIONS = SORT_FIELDS.flatMap((field) => {
  const first = DEFAULT_DIRECTION[field];
  const second: SortDirection = first === 'asc' ? 'desc' : 'asc';

  return [first, second].map((dir) => ({
    value: `${field}:${dir}`,
    label: SORT_LABELS[field][dir],
    sort: field,
    dir,
  }));
});

type FilterBarProps = {
  filters: TransactionFilters;
  hasActive: boolean;
  isFetching: boolean;
  onChange: (changes: Partial<TransactionFilters>, options?: { replace?: boolean }) => void;
  onClear: () => void;
  onRefresh: () => void;
};

export function FilterBar({
  filters,
  hasActive,
  isFetching,
  onChange,
  onClear,
  onRefresh,
}: FilterBarProps) {
  const canSortByAmount = filters.currency !== 'all';
  const rangeError =
    filters.from !== '' && filters.to !== '' && filters.from > filters.to
      ? 'Start date must be on or before the end date'
      : undefined;
  const sortOptions = SORT_OPTIONS.map((option) => ({
    ...option,
    disabled: option.sort === 'amount' && !canSortByAmount,
  }));

  return (
    <div className="space-y-3">
      <SearchBox
        label="Search"
        placeholder="Reference, name or email"
        value={filters.search}
        onCommit={(text) => onChange({ search: text }, { replace: true })}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(event) =>
            onChange({ status: isStatus(event.target.value) ? event.target.value : 'all' })
          }
        />
        <Select
          label="Currency"
          value={filters.currency}
          options={CURRENCY_OPTIONS}
          onChange={(event) =>
            onChange({ currency: isCurrency(event.target.value) ? event.target.value : 'all' })
          }
        />
        <Input
          label="From"
          type="date"
          value={filters.from}
          max={filters.to || undefined}
          error={rangeError}
          onChange={(event) => onChange({ from: event.target.value })}
        />
        <Input
          label="To"
          type="date"
          value={filters.to}
          min={filters.from || undefined}
          onChange={(event) => onChange({ to: event.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-64">
          <Select
            label="Sort by"
            value={`${filters.sort}:${filters.dir}`}
            options={sortOptions}
            onChange={(event) => {
              const option = SORT_OPTIONS.find((item) => item.value === event.target.value);
              if (option) onChange({ sort: option.sort, dir: option.dir });
            }}
          />
        </div>
        {hasActive && (
          <Button variant="secondary" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isFetching}>
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {!canSortByAmount && (
        <p className="text-xs text-slate-500">
          Choose a currency to sort by amount: amounts in different currencies cannot be compared.
        </p>
      )}
    </div>
  );
}
