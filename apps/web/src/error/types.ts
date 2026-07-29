import type { ErrorBoundaryProps } from 'react-error-boundary';

/**
 * Configuration for the error module.
 */
export type ErrorConfig = Pick<ErrorBoundaryProps, 'fallbackRender'>;
