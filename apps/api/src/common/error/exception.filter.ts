import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as IExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { getErrorResponse, getStatusCode } from './utils';

/**
 * A NestJS exception filter that catches exceptions and returns a response to the client.
 */
@Catch(Error)
export class ExceptionFilter implements IExceptionFilter<Error> {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: Error, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception.stack);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(getStatusCode(exception)).json(getErrorResponse(exception));
  }
}
