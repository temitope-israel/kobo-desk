import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../lib/api';
import type { Transaction } from '../../types/payment';

export const transactionKeys = {
  all: ['transactions'] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: ({ signal }) => apiGet<Transaction[]>('/api/transactions', signal),
  });
}
