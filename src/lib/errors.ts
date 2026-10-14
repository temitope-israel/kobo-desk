import { ApiError } from './api';

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.status === 403) return 'You do not have permission to see this.';
    if (error.status === 404) return 'We could not find what you were looking for.';
    if (error.status >= 500) return 'Our servers had a problem. Please try again in a moment.';
  }

  if (error instanceof TypeError) {
    return 'We could not reach the server. Check your internet connection.';
  }

  return 'Something unexpected happened. Please try again.';
}
