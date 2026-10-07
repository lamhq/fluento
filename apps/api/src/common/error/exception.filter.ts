import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
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
import { Response } from 'express';

import { ErrorResponse, ValidationErrorResponse } from './error-response';
import { RequestValidationException } from './request-validation.exception';

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
