import clsx from 'clsx';
import { NavLink } from 'react-router';
import { navItems } from '../../lib/navigation';

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-3 text-xl font-bold text-brand-700">Kobo Desk</div>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
