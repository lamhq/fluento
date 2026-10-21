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
