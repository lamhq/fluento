import { AxiosError } from 'axios';

import type { ErrorCode, ErrorInfo } from './types';

/**
 * Extracts error information from an unknown error object.
 * Handles AxiosError, Error, and other types, returning standardized error details.
 */
export function getErrorInfo(error: unknown): ErrorInfo {
  let message = 'Something went wrong. Please try reloading.';
  let code: ErrorCode = 'UNKNOWN_ERROR';

  if (error instanceof AxiosError) {
    if (error.request && !error.response) {
      // Network error
      code = 'NO_NETWORK_CONNECTION';
      message = 'You appear to be offline. Check your connection and try again.';
    } else if (error.response) {
      // HTTP error response
      const status = error.response.status;
      switch (status) {
        case 400:
          code = 'BAD_REQUEST';
          message = 'Something went wrong on our side. Please try again later.';
          break;
        case 401:
          code = 'UNAUTHORIZED_ACCESS';
          message = 'You must log in to view this content.';
          break;
        case 403:
          code = 'FORBIDDEN_ACCESS';
          message = "You don't have permission to view this resource.";
          break;
        case 408:
          code = 'TIMEOUT_ERROR';
          message = 'The operation took too long. Please retry.';
          break;
        case 429:
          code = 'RATE_LIMITING_ERROR';
          message =
            "You've reached the request limit. Please wait before trying again.";
          break;
        default:
          if (status >= 500) {
            code = 'SERVER_PROCESSING_ERROR';
            message = 'Something went wrong on the server. Please try again later.';
          } else {
            code = 'UNKNOWN_ERROR';
          }
      }
    }
  }

  return {
    code,
    message,
  };
}
