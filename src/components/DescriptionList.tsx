import type { ReactNode } from 'react';

type DescriptionItem = {
  label: string;
  value: ReactNode;
};

type DescriptionListProps = {
  items: DescriptionItem[];
};

export function DescriptionList({ items }: DescriptionListProps) {
  return (
    <dl className="divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
          <dt className="text-slate-500">{item.label}</dt>
          <dd className="break-words text-right font-medium text-slate-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
