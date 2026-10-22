import clsx from 'clsx';
import type { SortDirection, SortField } from './filters';

type SortableHeaderProps = {
  label: string;
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
  disabled?: boolean;
};

export function SortableHeader({
  label,
  field,
  activeField,
  direction,
  onSort,
  align = 'left',
  disabled = false,
}: SortableHeaderProps) {
  const isActive = field === activeField;
  const ariaSort = isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none';
  const arrow = isActive ? (direction === 'asc' ? '▲' : '▼') : '↕';

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={clsx('px-4 py-3 font-semibold', align === 'right' ? 'text-right' : 'text-left')}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        disabled={disabled}
        className={clsx(
          'inline-flex items-center gap-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-slate-900',
        )}
      >
        {label}
        <span aria-hidden="true" className="text-[0.65rem]">
          {arrow}
        </span>
      </button>
    </th>
  );
}
