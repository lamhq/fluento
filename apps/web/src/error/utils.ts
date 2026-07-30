import { AxiosError } from 'axios';

import type { ErrorCode, ErrorInfo } from './types';

/**
 * Extracts error information from an unknown error object.
 * Handles AxiosError, Error, and other types, returning standardized error details.
 */
export function getErrorInfo(error: unknown): ErrorInfo {
  let title = 'Unexpected Error';
  let description =
    'Something went wrong while rendering the page. Please try reloading.';
  let errorMessage = '';
  let errorCode: ErrorCode = 'UNKNOWN_ERROR';

  if (error instanceof AxiosError) {
    if (error.request && !error.response) {
      // Network error
      errorCode = 'NO_NETWORK_CONNECTION';
      title = 'No Internet Connection';
      description = 'You appear to be offline. Check your connection and try again.';
    } else if (error.response) {
      // HTTP error response
      const status = error.response.status;
      switch (status) {
        case 400:
          errorCode = 'BAD_REQUEST';
          title = 'Internal Error';
          description = 'Something went wrong on our side. Please try again later.';
          break;
        case 401:
          errorCode = 'UNAUTHORIZED_ACCESS';
          title = 'Authorization Required';
          description = 'You must log in to view this content.';
          break;
        case 403:
          errorCode = 'FORBIDDEN_ACCESS';
          title = 'Access Denied';
          description = "You don't have permission to view this resource.";
          break;
        case 408:
          errorCode = 'TIMEOUT_ERROR';
          title = 'Request Timed Out';
          description = 'The operation took too long. Please retry.';
          break;
        case 429:
          errorCode = 'RATE_LIMITING_ERROR';
          title = 'Too Many Requests';
          description =
            "You've reached the request limit. Please wait before trying again.";
          break;
        default:
          if (status >= 500) {
            errorCode = 'SERVER_PROCESSING_ERROR';
            title = 'Server Error';
            description =
              'Something went wrong on our side. Please try again later.';
          } else {
            errorCode = 'UNKNOWN_ERROR';
          }
      }
    }
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error) || 'An unexpected error occurred';
  }

  return {
    title,
    description,
    errorCode,
    errorMessage,
  };
}
