import type { ComponentType } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export type ErrorCode =
  | 'UNKNOWN_ERROR'
  | 'NO_NETWORK_CONNECTION'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED_ACCESS'
  | 'FORBIDDEN_ACCESS'
  | 'TIMEOUT_ERROR'
  | 'RATE_LIMITING_ERROR'
  | 'SERVER_PROCESSING_ERROR';

export interface ErrorInfo {
  code: ErrorCode;
  message: string;
}

/**
 * Configuration for the error module.
 */
export interface ErrorConfig {
  /**
   * React component to render when an error is caught
   */
  fallbackComponent?: ComponentType<FallbackProps>;
}
