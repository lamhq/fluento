import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ClassValidorPipe } from './common/error/class-validator.pipe';
import { ExceptionFilter } from './common/error/exception.filter';
import { SchemaValidationPipe } from './common/error/schema-validation.pipe';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // auto validate request using class-validator
  app.useGlobalPipes(new ClassValidorPipe(), new SchemaValidationPipe());

  // handle exceptions and return error response to client
  app.useGlobalFilters(new ExceptionFilter());

  return app;
}
