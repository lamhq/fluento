import { BadRequestException } from '@nestjs/common';

import { ErrorDetails } from './error-response';

/**
 * Exception thrown when class-validator validation fails
 */
export class RequestValidationException extends BadRequestException {
  /**
   * Type of the request data that caused the validation error (e.g., 'body', 'query').
   */
  public type?: string;

  constructor(public readonly errors: ErrorDetails) {
    super('Request validation failed');
  }
}
