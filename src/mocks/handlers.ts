import { delay, http, HttpResponse } from 'msw';
import { customers, disputes, refunds, settlements, transactions } from './data';
import { getMockMode } from './settings';

const NORMAL_DELAY_MS = 400;
const SLOW_DELAY_MS = 4000;

function listHandler(path: string, items: unknown[]) {
  return http.get(path, async () => {
    const mode = getMockMode();
    await delay(mode === 'slow' ? SLOW_DELAY_MS : NORMAL_DELAY_MS);

    if (mode === 'error') {
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

    return HttpResponse.json(mode === 'empty' ? [] : items);
  });
}

export const handlers = [
  listHandler('/api/transactions', transactions),
  listHandler('/api/customers', customers),
  listHandler('/api/settlements', settlements),
  listHandler('/api/refunds', refunds),
  listHandler('/api/disputes', disputes),
];