import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '../../../common/components/ErrorFallback';
import { useServerData } from '../../../hooks';

function FetchData() {
  const data = useServerData();
  return (
    <>
      <p>Data from server:</p>
      {data}
    </>
  );
}

export default function DataFetchingPage() {
  return (
    <>
      <h3>Data Fetching Demo</h3>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <Suspense fallback="Fetching ...">
              <FetchData />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
}
