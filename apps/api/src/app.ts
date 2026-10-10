import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ExceptionFilter } from './common/error/exception.filter';
import { SchemaValidationPipe } from './common/error/schema-validation.pipe';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // validate request body & query parameters using schema
  app.useGlobalPipes(new SchemaValidationPipe());

  // handle exceptions and return error response to client
  app.useGlobalFilters(new ExceptionFilter());

  return app;
}
