import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {
  ExceptionFilter,
  RequestValidationPipe,
} from './common/interface/error';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // auto validate request using class-validator
  app.useGlobalPipes(new RequestValidationPipe());

  // handle exceptions and return error response to client
  app.useGlobalFilters(new ExceptionFilter());

  return app;
}
