import type { Transaction } from '../../types/payment';

export function searchTransactions(transactions: Transaction[], query: string): Transaction[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') return transactions;

  return transactions.filter((transaction) =>
    [transaction.reference, transaction.customer.name, transaction.customer.email].some((field) =>
      field.toLowerCase().includes(needle),
    ),
  );
}
