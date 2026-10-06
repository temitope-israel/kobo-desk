import { delay, http, HttpResponse } from 'msw';
import { customers, disputes, refunds, settlements, transactions } from './data';

const RESPONSE_DELAY_MS = 400;

function listHandler(path: string, items: unknown[]) {
  return http.get(path, async () => {
    await delay(RESPONSE_DELAY_MS);
    return HttpResponse.json(items);
  });
}

export const handlers = [
  listHandler('/api/transactions', transactions),
  listHandler('/api/customers', customers),
  listHandler('/api/settlements', settlements),
  listHandler('/api/refunds', refunds),
  listHandler('/api/disputes', disputes),
];
