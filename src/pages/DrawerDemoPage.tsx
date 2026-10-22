import { useState } from 'react';
import { Button } from '../components/Button';
import { Drawer } from '../components/Drawer';
import { PageHeader } from '../components/PageHeader';
import { TransactionDetailPanel } from '../features/transactions/TransactionDetailPanel';
import { useTransactions } from '../features/transactions/useTransactions';
import { getLocalTimeZone } from '../lib/dates';

export function DrawerDemoPage() {
  const timeZone = getLocalTimeZone();
  const { data } = useTransactions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data?.find((transaction) => transaction.id === selectedId);

  return (
    <div className="p-6">
      <PageHeader
        title="Drawer demo"
        description="Open a transaction to see its details and timeline."
      />

      <ul className="flex flex-wrap gap-2">
        {data?.slice(0, 12).map((transaction) => (
          <li key={transaction.id}>
            <Button variant="secondary" size="sm" onClick={() => setSelectedId(transaction.id)}>
              {transaction.reference} ({transaction.status})
            </Button>
          </li>
        ))}
      </ul>

      <Drawer
        open={selected !== undefined}
        onClose={() => setSelectedId(null)}
        title="Transaction details"
      >
        {selected && <TransactionDetailPanel transaction={selected} timeZone={timeZone} />}
      </Drawer>
    </div>
  );
}
