import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as IExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { getErrorResponse, getStatusCode } from './utils.js';

/**
 * A NestJS exception filter that catches exceptions and returns a response to the client.
 */
@Catch(Error)
export class ExceptionFilter implements IExceptionFilter<Error> {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception.message, exception.stack);
    }

    // TODO: log exception to error tracking service
    // if exception not instanceof HttpException

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(getStatusCode(exception)).json(getErrorResponse(exception));
  }
}
