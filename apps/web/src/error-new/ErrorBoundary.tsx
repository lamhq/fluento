import type { Key, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKeys?: Key[];
}

export default function ErrorBoundary({ children, resetKeys }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} resetKeys={resetKeys}>
      {children}
    </ReactErrorBoundary>
  );
}
