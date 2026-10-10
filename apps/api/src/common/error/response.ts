/**
 * Errors object that maps field names to error messages or nested errors.
 */
export class FieldErrors {
  [field: string]: string | FieldErrors;
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

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}

/**
 * Response sent to client in case of a validation error
 */
export class ValidationErrorResponse extends ErrorResponse {
  /**
   * Detailed validation errors for each field.
   */
  details: FieldErrors;

  constructor(code: string, message: string, details: FieldErrors) {
    super(code, message);
    this.details = details;
  }
}
