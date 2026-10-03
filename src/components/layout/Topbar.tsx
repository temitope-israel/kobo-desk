import { Button } from '../Button';

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
      <Button
        variant="secondary"
        size="sm"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm text-slate-600 sm:inline">Demo Merchant</span>
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
        >
          DM
        </div>
      </div>
    </header>
  );
}
