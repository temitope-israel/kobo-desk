import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <p className="text-5xl font-bold text-brand-700">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-1 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block font-medium text-brand-700 hover:underline">
        Back to Overview
      </Link>
    </main>
  );
}
