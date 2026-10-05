import { Link, Outlet } from 'react-router';

import { MANAGE_EXERCISE_LIST_ROUTE, PRACTICE_ROUTE } from '../../routes';
import ErrorBoundary from './ErrorBoundary';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 p-2 sm:flex-row sm:items-center sm:p-4 lg:px-8">
          <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
            <Link
              to={PRACTICE_ROUTE}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Practice
            </Link>
            <Link
              to={MANAGE_EXERCISE_LIST_ROUTE}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Exercise List
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl p-2 md:p-4 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
