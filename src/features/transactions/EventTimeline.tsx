import clsx from 'clsx';
import { formatTimestamp } from '../../lib/format';
import type { TransactionEvent } from '../../types/payment';

const DOT_COLOURS: Record<TransactionEvent['type'], string> = {
  initiated: 'bg-slate-400',
  authorised: 'bg-sky-500',
  succeeded: 'bg-green-500',
  failed: 'bg-red-500',
  pending: 'bg-amber-500',
  refunded: 'bg-slate-600',
};

type EventTimelineProps = {
  events: TransactionEvent[];
  timeZone: string;
};

export function EventTimeline({ events, timeZone }: EventTimelineProps) {
  return (
    <ol className="relative ml-1.5 space-y-5 border-l border-slate-200 pl-5">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            aria-hidden="true"
            className={clsx(
              'absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full ring-4 ring-white',
              DOT_COLOURS[event.type],
            )}
          />
          <p className="text-sm font-medium text-slate-900">{event.message}</p>
          <time dateTime={event.at} className="text-xs text-slate-500">
            {formatTimestamp(event.at, timeZone)}
          </time>
        </li>
      ))}
    </ol>
  );
}
