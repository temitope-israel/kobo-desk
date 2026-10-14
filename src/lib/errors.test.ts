import { describe, expect, it } from 'vitest';
import { ApiError } from './api';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('explains an expired session for 401', () => {
    expect(getErrorMessage(new ApiError('x', 401))).toContain('session');
  });

  it('explains missing permission for 403', () => {
    expect(getErrorMessage(new ApiError('x', 403))).toContain('permission');
  });

  it('explains a mission item for 404', () => {
    expect(getErrorMessage(new ApiError('x', 404))).toContain('could not find');
  });

  it('explains a server problem for any 5xx', () => {
    expect(getErrorMessage(new ApiError('x', 500))).toContain('servers');
    expect(getErrorMessage(new ApiError('x', 503))).toContain('servers');
  });

  it('explains a connection problem for a network failure', () => {
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toContain('internet');
  });

  it('falls back to a general message', () => {
    expect(getErrorMessage('???')).toContain('unexpected');
  });

  it('never shows technical details to the user', () => {
    const message = getErrorMessage(new ApiError('Request to /api/secret failed', 500));

    expect(message).not.toContain('/api/secret');
  });
});
