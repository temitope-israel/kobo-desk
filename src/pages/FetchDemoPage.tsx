import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import type { Transaction } from '../types/payment';

export function FetchDemoPage() {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    apiGet<Transaction[]>('/api/transactions')
      .then((result) => {
        if (ignore) return;
        setData(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600"> Error: {error}</p>;
  return <p className="p-6">{data?.length} transactions (fetched by hand)</p>;
}
