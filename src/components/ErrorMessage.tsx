import { Button } from './Button';

type ErrorMessageProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  isRetrying = false,
}: ErrorMessageProps) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5">
      <h2 className="font-semibold text-red-800">{title}</h2>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? 'Trying again...' : 'Try again'}
        </Button>
      )}
    </div>
  );
}
