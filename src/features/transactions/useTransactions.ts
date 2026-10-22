import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../lib/api';
import type { Transaction, TransactionDetail } from '../../types/payment';

const all = ['transactions'] as const;

export const transactionKeys = {
  all,
  detail: (id: string | null) => [...all, 'detail', id] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: ({ signal }) => apiGet<Transaction[]>('/api/transactions', signal),
  });
}

export function useTransactionDetail(id: string | null) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: ({ signal }) => apiGet<TransactionDetail>(`/api/transactions/${id}`, signal),
    enabled: id !== null,
  });
}
