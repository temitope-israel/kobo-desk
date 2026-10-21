export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  /** The number of the first row shown (1-based), or 0 when there are no rows */
  from: number;
  /** The number of the last row shown */
  to: number;
};

export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    page: safePage,
    pageSize,
    pageCount,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + pageItems.length,
  };
}
