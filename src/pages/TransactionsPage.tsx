import { Button } from '../components/Button';
import { Drawer } from '../components/Drawer';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { InlineNotice } from '../components/InlineNotice';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { SkeletonRows } from '../components/Skeleton';
import { FilterBar } from '../features/transactions/FilterBar';
import {
  applyFilters,
  hasActiveFilters,
  nextSort,
  PAGE_SIZES,
} from '../features/transactions/filters';
import type { SortField } from '../features/transactions/filters';
import { TransactionCards } from '../features/transactions/TransactionCards';
import { TransactionDetailPanel } from '../features/transactions/TransactionDetailPanel';
import { TransactionsTable } from '../features/transactions/TransactionsTable';
import { useTransactionFilters } from '../features/transactions/useTransactionFilters';
import { useTransactions } from '../features/transactions/useTransactions';
import { getLocalTimeZone } from '../lib/dates';
import { getErrorMessage } from '../lib/errors';
import { paginate } from '../lib/paginate';

export function TransactionsPage() {
  const timeZone = getLocalTimeZone();
  const { filters, update, clearFilters, selectedId, select } = useTransactionFilters();
  const { data, isPending, isError, error, isFetching, refetch } = useTransactions();

  const results = data === undefined ? [] : applyFilters(data, filters, timeZone);
  const pageData = paginate(results, filters.page, filters.pageSize);
  const selected = data?.find((transaction) => transaction.id === selectedId);
  const missingSelection = data !== undefined && selectedId !== null && selected === undefined;
  const hasActive = hasActiveFilters(filters);

  function handleSort(field: SortField) {
    update(nextSort({ sort: filters.sort, dir: filters.dir }, field));
  }

  function closeDetail() {
    if (selectedId !== null) select(null);
  }

  return (
    <div>
      <PageHeader title="Transactions" description="Every payment, searchable and filterable." />

      {isPending && <SkeletonRows rows={8} />}

      {isError && data === undefined && (
        <ErrorMessage
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}

      {data !== undefined && (
        <div className="space-y-4">
          {isError && (
            <InlineNotice
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  {isFetching ? 'Trying again...' : 'Try again'}
                </Button>
              }
            >
              We could not refresh your transactions. You are seeing the data we loaded earlier.
            </InlineNotice>
          )}

          {missingSelection && (
            <InlineNotice
              action={
                <Button variant="secondary" size="sm" onClick={() => select(null)}>
                  Dismiss
                </Button>
              }
            >
              We could not find that transaction. It may not exist, or the link may be wrong.
            </InlineNotice>
          )}

          {data.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="When customers pay you, their payments will show up here."
            />
          ) : (
            <>
              <FilterBar
                filters={filters}
                hasActive={hasActive}
                isFetching={isFetching}
                onChange={update}
                onClear={clearFilters}
                onRefresh={() => refetch()}
              />

              {results.length === 0 ? (
                <EmptyState
                  title="No matching transactions"
                  description="Try changing or clearing your filters."
                  action={
                    hasActive ? (
                      <Button variant="secondary" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <>
                  <TransactionsTable
                    transactions={pageData.items}
                    timeZone={timeZone}
                    sort={filters.sort}
                    dir={filters.dir}
                    canSortByAmount={filters.currency !== 'all'}
                    onSort={handleSort}
                    onSelect={select}
                  />
                  <TransactionCards
                    transactions={pageData.items}
                    timeZone={timeZone}
                    onSelect={select}
                  />
                  <Pagination
                    page={pageData.page}
                    pageCount={pageData.pageCount}
                    pageSize={filters.pageSize}
                    pageSizeOptions={PAGE_SIZES}
                    from={pageData.from}
                    to={pageData.to}
                    total={pageData.total}
                    onPageChange={(page) => update({ page })}
                    onPageSizeChange={(pageSize) => update({ pageSize })}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}

      <Drawer open={selected !== undefined} onClose={closeDetail} title="Transaction details">
        {selected && <TransactionDetailPanel transaction={selected} timeZone={timeZone} />}
      </Drawer>
    </div>
  );
}
