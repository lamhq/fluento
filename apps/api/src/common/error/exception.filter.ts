import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as IExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

import { getErrorResponse, getStatusCode } from './utils';

/**
 * A NestJS exception filter that catches exceptions and returns a response to the client.
 */
@Catch(Error)
export class ExceptionFilter implements IExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost) {
    // TODO: log exception to error tracking service
    // if exception not instanceof HttpException

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(getStatusCode(exception)).json(getErrorResponse(exception));
  }
}
