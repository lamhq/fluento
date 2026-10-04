/**
 * Errors object that maps field names to error messages or nested errors.
 */
export class ErrorDetails {
  [field: string]: string | ErrorDetails;
}

/**
 * Response sent to client in case of a generic error
 */
export class ErrorResponse {
  /**
   * Unique error code in the API.
   */
  code: string;

  /**
   * Human-readable error message.
   */
  message: string;

  constructor(data: Partial<ErrorResponse>) {
    Object.assign(this, data);
  }
}

/**
 * Response sent to client in case of a validation error
 */
export class ValidationErrorResponse extends ErrorResponse {
  details: ErrorDetails;

  constructor(data: Partial<ValidationErrorResponse>) {
    super(data);
    Object.assign(this, data);
  }
}
