import clsx from 'clsx';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={clsx('animate-pulse rounded-md bg-slate-200', className)} />
  );
}

type SkeletonRowsProps = {
  rows?: number;
};

export function SkeletonRows({ rows = 5 }: SkeletonRowsProps) {
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <span className="sr-only">Loading</span>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
