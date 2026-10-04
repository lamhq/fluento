import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import {
  ArgumentsHost,
  BadGatewayException,
  Catch,
  ConflictException,
  ExceptionFilter as IExceptionFilter,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  HttpVersionNotSupportedException,
  ImATeapotException,
  InternalServerErrorException,
  Logger,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

/**
 * Errors object that maps field names to error messages or nested errors.
 */
export class ErrorDetails {
  [field: string]: string | ErrorDetails;
}

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

/**
 * NestJS pipe that validates and transforms incoming request using class-validator
 * It returns an exception if the validation fails.
 * https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
 */
@Injectable()
export class RequestValidationPipe extends ValidationPipe {
  constructor() {
    super({
      // required properties cannot be omitted from the request body
      skipMissingProperties: false,

      // properties that don't have validation decorators will be removed from the transformed result
      whitelist: true,

      // throw an error if object contain unknown properties
      forbidNonWhitelisted: true,

      // return validation errors to caller
      disableErrorMessages: false,

      // transform plain JavaScript objects to class object
      transform: true,

      // transform class-validator errors to exception
      exceptionFactory: (validationErrors) => {
        const errors = this.transformValidationErrors(validationErrors);
        return new RequestValidationException(errors);
      },
    });
  }

  /**
   * Validate and transform the input data to class object
   * @param value The incoming request object data.
   * @param metadata Metadata about the request object data (e.g. parameter type).
   * @returns The transformed and validated data.
   * @throws A validation error if the input data fails validation.
   */
  public async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    // skip validation if value is not a plain object
    if (typeof value !== 'object' || !value) {
      return value;
    }
    try {
      return await super.transform(value, metadata);
    } catch (exception) {
      if (exception instanceof RequestValidationException) {
        exception.type = metadata.type;
      }
      throw exception;
    }
  }

  /**
   * Convert class-validator errors to ErrorDetails
   */
  private transformValidationErrors(errors: ValidationError[]): ErrorDetails {
    return errors.reduce((previousValue, currentValue) => {
      if (currentValue.constraints) {
        return {
          ...previousValue,
          [currentValue.property]: Object.values(currentValue.constraints)[0],
        };
      }
      return {
        ...previousValue,
        [currentValue.property]: currentValue.children
          ? currentValue.children.map((item) =>
              this.transformValidationErrors(item.children ?? []),
            )
          : undefined,
      };
    }, {});
  }
}

/**
 * A NestJS exception filter that catches exceptions and return a response to client
 */
@Catch(Error)
export class ExceptionFilter implements IExceptionFilter<Error> {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      status = 500;
      this.logger.error(exception.stack);
    }
    response.status(status).json(this.getErrorResponse(exception));
  }

  /**
   * Create a response to send to the API client for an occurred exception
   */
  private getErrorResponse(exception: Error): ErrorResponse {
    const code = this.getErrorCode(exception);

    if (exception instanceof RequestValidationException) {
      return new ValidationErrorResponse({
        code,
        message: exception.message,
        details: exception.errors,
      });
    }

    return new ErrorResponse({
      code,
      message: exception.message,
    });
  }

  /**
   * Retrieve the error code for generating an error response to be sent to the client
   */
  private getErrorCode(exception: Error): string {
    if (exception instanceof RequestValidationException) {
      switch (exception.type) {
        case 'body':
          return 'invalid_request_body';
        case 'query':
          return 'invalid_request_params';
      }
    }

    // built in NestJS exceptions
    if (exception instanceof BadRequestException) return 'bad_request';
    if (exception instanceof UnauthorizedException) return 'unauthorized';
    if (exception instanceof NotFoundException) return 'not_found';
    if (exception instanceof ForbiddenException) return 'forbidden';
    if (exception instanceof NotAcceptableException) return 'not_acceptable';
    if (exception instanceof RequestTimeoutException) return 'request_timeout';
    if (exception instanceof ConflictException) return 'conflict';
    if (exception instanceof GoneException) return 'gone';
    if (exception instanceof HttpVersionNotSupportedException)
      return 'http_version_not_supported';
    if (exception instanceof PayloadTooLargeException)
      return 'payload_too_large';
    if (exception instanceof UnsupportedMediaTypeException)
      return 'unsupported_media_type';
    if (exception instanceof UnprocessableEntityException)
      return 'unprocessable_entity';
    if (exception instanceof InternalServerErrorException)
      return 'internal_server_error';
    if (exception instanceof NotImplementedException) return 'not_implemented';
    if (exception instanceof ImATeapotException) return 'im_a_teapot';
    if (exception instanceof MethodNotAllowedException)
      return 'method_not_allowed';
    if (exception instanceof BadGatewayException) return 'bad_gateway';
    if (exception instanceof ServiceUnavailableException)
      return 'service_unavailable';
    if (exception instanceof GatewayTimeoutException) return 'gateway_timeout';
    if (exception instanceof PreconditionFailedException)
      return 'precondition_failed';

    // Return a default error code if the exception is not recognized
    return 'internal_error';
  }
}
