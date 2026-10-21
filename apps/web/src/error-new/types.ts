export type FieldErrors = Record<string, string>;

export class FormError extends Error {
  readonly details: FieldErrors;

  constructor(fieldErrors: FieldErrors) {
    super('The submitted form contains errors.');
    this.name = 'FormError';
    this.details = fieldErrors;
  }
}

export class UnAuthorizedError extends Error {
  constructor(message = 'Please sign in to continue.') {
    super(message);
    this.name = 'UnAuthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You don't have permission to access this page.") {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'The page you are looking for could not be found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends Error {
  constructor(
    message = 'No network connection. Check your connection and try again.',
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ServerError extends Error {
  constructor(message = 'Something went wrong. Please try again.') {
    super(message);
    this.name = 'ServerError';
  }
}
