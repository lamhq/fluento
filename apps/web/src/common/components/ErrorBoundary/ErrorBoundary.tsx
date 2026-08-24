import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary as Reb } from 'react-error-boundary';
import { useLocation } from 'react-router';

import ErrorFallback from '../ErrorFallback';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Reb
          FallbackComponent={ErrorFallback}

          /* clears React Query's internal error state */
          onReset={reset}

          /* reset ErrorBoundary on route change */
          resetKeys={[location.pathname]}
        >
          {children}
        </Reb>
      )}
    </QueryErrorResetBoundary>
  );
}
