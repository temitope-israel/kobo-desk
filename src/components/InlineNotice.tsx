import type { ReactNode } from 'react';

type InlineNoticeProps = {
  children: ReactNode;
  action?: ReactNode;
};

export function InlineNotice({ children, action }: InlineNoticeProps) {
  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p>{children}</p>
      {action}
    </div>
  );
}
