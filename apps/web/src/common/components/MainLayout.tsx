import { Outlet } from 'react-router';

import ErrorBoundary from './ErrorBoundary';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
