import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import type { PaymentStatus } from '../types/payment';

const statuses: PaymentStatus[] = ['successful', 'failed', 'pending', 'refunded'];

export function ComponentsPreview() {
  return (
    <main className="mx-auto  max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold text-brand-700">Components preview</h1>

      <Card heading="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      <Card heading="Status badges">
        <div className="flex flex-wrap gap-3">
          {statuses
            .filter((status) => status !== 'refunded')
            .map((status) => (
              <Badge key={status} status={status} />
            ))}
        </div>
      </Card>

      <Card heading="Inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Customer email" type="email" placeholder="ada@example.com" />
          <Input label="Amount" type="number" error="Amount must be greater than 0" />
        </div>
      </Card>
    </main>
  );
}
