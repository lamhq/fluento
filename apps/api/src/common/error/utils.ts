import { HttpException, HttpStatus } from '@nestjs/common';

import {
  ErrorResponse,
  FieldErrors,
  ValidationErrorResponse,
} from './response';
import {
  SchemaValidationException,
  SchemaValidationIssues,
} from './schema-validation.exception';

const DEFAULT_ERROR_RESPONSE = {
  code: 'internal_error',
  message: 'An unexpected error occurred. Please try again later.',
};

const HTTP_ERROR_RESPONSES: Partial<
  Record<number, Pick<ErrorResponse, 'code' | 'message'>>
> = {
  [HttpStatus.BAD_REQUEST]: {
    code: 'bad_request',
    message: 'Your request could not be processed.',
  },
  [HttpStatus.UNAUTHORIZED]: {
    code: 'unauthorized',
    message: 'Authentication is required.',
  },
  [HttpStatus.FORBIDDEN]: {
    code: 'forbidden',
    message: 'You are not allowed to access this resource.',
  },
  [HttpStatus.NOT_FOUND]: {
    code: 'not_found',
    message: 'The requested resource was not found.',
  },
  [HttpStatus.METHOD_NOT_ALLOWED]: {
    code: 'method_not_allowed',
    message: 'This request method is not supported.',
  },
  [HttpStatus.NOT_ACCEPTABLE]: {
    code: 'not_acceptable',
    message: 'The request is not acceptable.',
  },
  [HttpStatus.REQUEST_TIMEOUT]: {
    code: 'request_timeout',
    message: 'The request timed out.',
  },
  [HttpStatus.CONFLICT]: {
    code: 'conflict',
    message: 'The request conflicts with the current state.',
  },
  [HttpStatus.GONE]: {
    code: 'gone',
    message: 'The requested resource is no longer available.',
  },
  [HttpStatus.PRECONDITION_FAILED]: {
    code: 'precondition_failed',
    message: 'The request did not meet its required conditions.',
  },
  [HttpStatus.PAYLOAD_TOO_LARGE]: {
    code: 'payload_too_large',
    message: 'The request payload is too large.',
  },
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: {
    code: 'unsupported_media_type',
    message: 'The request media type is not supported.',
  },
  [HttpStatus.UNPROCESSABLE_ENTITY]: {
    code: 'unprocessable_entity',
    message: 'The request could not be processed.',
  },
  [HttpStatus.I_AM_A_TEAPOT]: {
    code: 'im_a_teapot',
    message: 'The server cannot process this request.',
  },
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: {
    code: 'http_version_not_supported',
    message: 'The HTTP version is not supported.',
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    code: 'internal_server_error',
    message: DEFAULT_ERROR_RESPONSE.message,
  },
  [HttpStatus.NOT_IMPLEMENTED]: {
    code: 'not_implemented',
    message: 'This operation is not supported.',
  },
  [HttpStatus.BAD_GATEWAY]: {
    code: 'bad_gateway',
    message: 'The service is temporarily unavailable.',
  },
  [HttpStatus.SERVICE_UNAVAILABLE]: {
    code: 'service_unavailable',
    message: 'The service is temporarily unavailable.',
  },
  [HttpStatus.GATEWAY_TIMEOUT]: {
    code: 'gateway_timeout',
    message: 'The service did not respond in time.',
  },
};

interface ValidationIssue {
  message: string;
  path?: readonly unknown[];
}

export function tranformSchemaErrorToFieldError(
  issues: SchemaValidationIssues,
): FieldErrors {
  const details: FieldErrors = {};

  const addIssues = (validationIssues: readonly ValidationIssue[]) => {
    for (const issue of validationIssues) {
      const nestedIssues =
        'errors' in issue && Array.isArray(issue.errors)
          ? issue.errors.flat()
          : undefined;
      if (nestedIssues?.length) {
        addIssues(nestedIssues);
        continue;
      }

      const pathSegment = issue.path?.[0];
      const field =
        typeof pathSegment === 'string'
          ? pathSegment
          : typeof pathSegment === 'object' &&
              pathSegment !== null &&
              'key' in pathSegment
            ? String(pathSegment.key)
            : undefined;
      const issueKeys = 'keys' in issue ? issue.keys : undefined;
      if (!field && Array.isArray(issueKeys)) {
        for (const key of issueKeys) {
          if (typeof key === 'string') {
            details[key] = `property ${key} should not exist`;
          }
        }
        continue;
      }

      details[field ?? 'body'] ??= issue.message;
    }
  };

  addIssues(issues);
  return details;
}

export function getStatusCode(exception: Error): HttpStatus {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
}

export function getErrorResponse(exception: Error): ErrorResponse {
  const code = getErrorCode(exception);
  const message = getErrorMessage(exception);
  const details = getErrorDetails(exception);

  if (details) {
    return new ValidationErrorResponse(code, message, details);
  }

  return new ErrorResponse(code, message);
}

export function getErrorMessage(exception: Error): string {
  if (exception instanceof SchemaValidationException) {
    return 'Request validation failed';
  }

  if (exception instanceof HttpException) {
    return (
      HTTP_ERROR_RESPONSES[exception.getStatus()]?.message ??
      DEFAULT_ERROR_RESPONSE.message
    );
  }

  return DEFAULT_ERROR_RESPONSE.message;
}

export function getErrorDetails(exception: Error): FieldErrors | undefined {
  return exception instanceof SchemaValidationException
    ? tranformSchemaErrorToFieldError(exception.issues)
    : undefined;
}

export function getErrorCode(exception: Error): string {
  if (exception instanceof SchemaValidationException) {
    return exception.source === 'query'
      ? 'invalid_request_params'
      : 'invalid_request_body';
  }

  if (exception instanceof HttpException) {
    return (
      HTTP_ERROR_RESPONSES[exception.getStatus()]?.code ??
      DEFAULT_ERROR_RESPONSE.code
    );
  }

  return DEFAULT_ERROR_RESPONSE.code;
}
