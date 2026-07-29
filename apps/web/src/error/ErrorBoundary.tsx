import {
  ErrorBoundary as BaseErrorBoundary,
  type ErrorBoundaryProps,
  type FallbackProps,
} from 'react-error-boundary';

import { useErrorConfig } from './useErrorConfig';

/**
 * Component that catches render errors and displays a fallback UI.
 * Uses the fallback components provided through ErrorProvider.
 */
export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const { fallbackRender: passedRender, onReset, children } = props;
  const { fallbackRender: configRender } = useErrorConfig();

  return (
    <BaseErrorBoundary
      fallbackRender={passedRender ?? configRender ?? defaultRender}
      onReset={onReset}
    >
      {children}
    </BaseErrorBoundary>
  );
}

/**
 * Render function that displays the default error fallback UI
 */
const defaultRender = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;

  const errorMessage =
    error instanceof Error
      ? error.message
      : String(error) || 'An unexpected error occurred';

  return (
    <>
      <h1>Oops! Something went wrong</h1>
      <p>{errorMessage}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </>
  );
};
