import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiGet } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiGet', () => {
  it('returns the parsed JSON when the request succeeds', async () => {
    const fakeFetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }));
    vi.stubGlobal('fetch', fakeFetch);

    await expect(apiGet('/api/things')).resolves.toEqual([{ id: 1 }]);

    expect(fakeFetch).toHaveBeenCalledWith('/api/things', { signal: undefined });
  });

  it('throws an ApiError that carries the status code when the server says no', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 503 })));

    await expect(apiGet('/api/things')).rejects.toMatchObject({ name: 'ApiError', status: 503 });
  });
});
