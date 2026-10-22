import { delay, http, HttpResponse } from 'msw';
import {
  customers,
  disputes,
  getTransactionDetail,
  refunds,
  settlements,
  transactions,
} from './data';
import { getMockMode } from './settings';

const NORMAL_DELAY_MS = 400;
const SLOW_DELAY_MS = 4000;

async function simulateNetwork() {
  const mode = getMockMode();
  await delay(mode === 'slow' ? SLOW_DELAY_MS : NORMAL_DELAY_MS);
  return mode;
}

function serverError() {
  return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
}

function listHandler(path: string, items: unknown[]) {
  return http.get(path, async () => {
    const mode = await simulateNetwork();
    if (mode === 'error') return serverError();

    return HttpResponse.json(mode === 'empty' ? [] : items);
  });
}

export const handlers = [
  listHandler('/api/transactions', transactions),
  listHandler('/api/customers', customers),
  listHandler('/api/settlements', settlements),
  listHandler('/api/refunds', refunds),
  listHandler('/api/disputes', disputes),

  http.get('/api/transactions/:id', async ({ params }) => {
    const mode = await simulateNetwork();
    if (mode === 'error') return serverError();

    const detail = getTransactionDetail(String(params.id));
    if (!detail) {
      return HttpResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return HttpResponse.json(detail);
  }),
];
