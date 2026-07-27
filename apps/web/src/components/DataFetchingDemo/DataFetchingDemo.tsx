import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useServerData } from '../../hooks';

function FetchData() {
  const data = useServerData();
  return data;
}

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div>
      <p>{error instanceof Error ? error.message : String(error)}</p>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

export default function DataFetchingDemo() {
  return (
    <>
      <h3>Data Fetching Demo</h3>
      <p>Data from server:</p>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <Suspense fallback="Fetching ...">
              <FetchData />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
}
