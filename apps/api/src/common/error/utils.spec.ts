import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { ErrorResponse, ValidationErrorResponse } from './response.js';
import {
  SchemaValidationException,
  SchemaValidationIssues,
} from './schema-validation.exception.js';
import {
  getErrorCode,
  getErrorDetails,
  getErrorMessage,
  getErrorResponse,
  getStatusCode,
  tranformSchemaErrorToFieldError,
} from './utils.js';

describe('tranformSchemaErrorToFieldError', () => {
  it('maps issue paths to field messages and uses body for pathless issues', () => {
    const issues: SchemaValidationIssues = [
      { message: 'Required', path: ['name'] },
      { message: 'Invalid request' },
    ];

    expect(tranformSchemaErrorToFieldError(issues)).toEqual({
      name: 'Required',
      body: 'Invalid request',
    });
  });

  it('keeps first message for duplicate fields and supports object path segments', () => {
    const issues: SchemaValidationIssues = [
      { message: 'First message', path: ['name'] },
      { message: 'Second message', path: ['name'] },
      { message: 'Invalid value', path: [{ key: 'age' }] },
    ];

    expect(tranformSchemaErrorToFieldError(issues)).toEqual({
      name: 'First message',
      age: 'Invalid value',
    });
  });

  it('flattens nested issues and reports unknown keys', () => {
    const nestedIssue = {
      message: 'Invalid object',
      errors: [[{ message: 'Required', path: ['email'] }]],
    };
    const unknownKeysIssue = { message: 'Unknown keys', keys: ['extra', 1] };
    const issues: SchemaValidationIssues = [nestedIssue, unknownKeysIssue];

    expect(tranformSchemaErrorToFieldError(issues)).toEqual({
      email: 'Required',
      extra: 'property extra should not exist',
    });
  });
});

describe('getStatusCode', () => {
  it('returns status code for HttpException and internal server error otherwise', () => {
    expect(getStatusCode(new BadRequestException())).toBe(HttpStatus.BAD_REQUEST);
    expect(getStatusCode(new Error('failure'))).toBe(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});

describe('getErrorCode', () => {
  it('returns mapped code for known HTTP status', () => {
    expect(getErrorCode(new BadRequestException())).toBe('bad_request');
  });

  it('uses safe defaults for unknown HTTP statuses and generic errors', () => {
    expect(getErrorCode(new HttpException('failure', 499))).toBe('internal_error');
    expect(getErrorCode(new Error('failure'))).toBe('internal_error');
  });

  it('maps schema validation exceptions by source', () => {
    const exception = new SchemaValidationException([
      { message: 'Required', path: ['email'] },
    ]);

    expect(getErrorCode(exception)).toBe('invalid_request_body');

    exception.source = 'query';
    expect(getErrorCode(exception)).toBe('invalid_request_params');
  });
});

describe('getErrorMessage', () => {
  it('returns mapped message for known HTTP status', () => {
    expect(getErrorMessage(new BadRequestException())).toBe(
      'Your request could not be processed.',
    );
  });

  it('uses safe defaults for unknown HTTP statuses and generic errors', () => {
    const defaultMessage = 'An unexpected error occurred. Please try again later.';

    expect(getErrorMessage(new HttpException('failure', 499))).toBe(defaultMessage);
    expect(getErrorMessage(new Error('failure'))).toBe(defaultMessage);
  });

  it('returns validation failure message for schema validation exceptions', () => {
    const exception = new SchemaValidationException([
      { message: 'Required', path: ['email'] },
    ]);

    expect(getErrorMessage(exception)).toBe('Request validation failed');
  });
});

describe('getErrorDetails', () => {
  it('returns field details for schema validation exceptions', () => {
    const exception = new SchemaValidationException([
      { message: 'Required', path: ['email'] },
    ]);

    expect(getErrorDetails(exception)).toEqual({ email: 'Required' });
  });

  it('returns undefined for other errors', () => {
    expect(getErrorDetails(new Error('failure'))).toBeUndefined();
  });
});

describe('getErrorResponse', () => {
  it('returns client-safe error response instances', () => {
    const genericResponse = getErrorResponse(new Error('failure'));
    const validationResponse = getErrorResponse(
      new SchemaValidationException([{ message: 'Required', path: ['email'] }]),
    );

    expect(genericResponse).toBeInstanceOf(ErrorResponse);
    expect(genericResponse).toEqual({
      code: 'internal_error',
      message: 'An unexpected error occurred. Please try again later.',
    });
    expect(validationResponse).toBeInstanceOf(ValidationErrorResponse);
    expect(validationResponse).toEqual({
      code: 'invalid_request_body',
      message: 'Request validation failed',
      details: { email: 'Required' },
    });
  });
});
