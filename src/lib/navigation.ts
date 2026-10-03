export type NavItem = {
  label: string;
  to: string;
  end?: boolean;
};

export const navItems: NavItem[] = [
  { label: 'Overview', to: '/', end: true },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Balance and Settlements', to: '/balance' },
  { label: 'Disputes', to: '/disputes' },
  { label: 'Customers', to: '/customers' },
  { label: 'Payment Links', to: '/payment-links' },
  { label: 'Settings', to: '/settings' },
];
