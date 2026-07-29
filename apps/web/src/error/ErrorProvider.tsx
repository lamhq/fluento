import { ErrorConfigContext } from './contexts';
import type { ErrorConfig } from './types';

export interface ErrorProviderProps extends ErrorConfig {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Provider component that supplies error handling configuration to the application.
 * Must wrap components that use ErrorBoundary or useErrorHandler.
 */
export default function ErrorProvider(props: ErrorProviderProps) {
  const { fallbackComponent, children } = props;

  return (
    <ErrorConfigContext.Provider value={{ fallbackComponent }}>
      {children}
    </ErrorConfigContext.Provider>
  );
}
