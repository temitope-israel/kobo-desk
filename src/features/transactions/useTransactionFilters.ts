import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { parseFilters, writeFilters } from './filters';
import type { TransactionFilters } from './filters';

type UpdateOptions = {
  /** Replace the current history entry instead of adding a new one */
  replace?: boolean;
};

export function useTransactionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const selectedId = searchParams.get('tx');

  function update(changes: Partial<TransactionFilters>, options: UpdateOptions = {}) {
    setSearchParams(
      (previous) => writeFilters(previous, { ...parseFilters(previous), page: 1, ...changes }),
      { replace: options.replace },
    );
  }

  function clearFilters() {
    update({ search: '', status: 'all', currency: 'all', from: '', to: '' });
  }

  function select(id: string | null) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (id === null) {
        next.delete('tx');
      } else {
        next.set('tx', id);
      }
      return next;
    });
  }

  return { filters, update, clearFilters, selectedId, select };
}
