import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  heading?: string;
};

export function Card({ heading, className, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}
      {...rest}
    >
      {heading && <h3 className="mb-3 text-sm font-semibold text-slate-500">{heading}</h3>}
      {children}
    </div>
  );
}
