import { Button } from './Button';

type PaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function Pagination({
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  from,
  to,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-3">
      <p aria-live="polite" className="text-sm text-slate-600">
        Showing {from} to {to} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Rows per page
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>

          <span className="text-sm text-slate-600">
            Page {page} of {pageCount}
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </nav>
  );
}
