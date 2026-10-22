import { useState } from 'react';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { InlineNotice } from '../components/InlineNotice';
import { Input } from '../components/Input';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { SkeletonRows } from '../components/Skeleton';
import { getLocalTimeZone } from '../lib/dates';
import { searchTransactions } from '../features/transactions/search';
import { TransactionCards } from '../features/transactions/TransactionCards';
import { TransactionsTable } from '../features/transactions/TransactionsTable';
import { useTransactions } from '../features/transactions/useTransactions';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getErrorMessage } from '../lib/errors';
import { paginate } from '../lib/paginate';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebouncedValue(search, 250);
  const timeZone = getLocalTimeZone();

  const { data, isPending, isError, error, isFetching, refetch } = useTransactions();

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  const results = data === undefined ? [] : searchTransactions(data, debouncedSearch);
  const pageData = paginate(results, page, pageSize);

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

          {data.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="When customers pay you, their payments will show up here."
            />
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-full sm:max-w-xs">
                  <Input
                    label="Search"
                    type="search"
                    placeholder="Reference, name or email"
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                  />
                </div>
                <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {results.length === 0 ? (
                <EmptyState
                  title="No matching transactions"
                  description={`Nothing matches "${debouncedSearch.trim()}".`}
                  action={
                    <Button variant="secondary" onClick={() => handleSearchChange('')}>
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <>
                  <TransactionsTable transactions={pageData.items} timeZone={timeZone} />
                  <TransactionCards transactions={pageData.items} timeZone={timeZone} />
                  <Pagination
                    page={pageData.page}
                    pageCount={pageData.pageCount}
                    pageSize={pageSize}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    from={pageData.from}
                    to={pageData.to}
                    total={pageData.total}
                    onPageChange={setPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
