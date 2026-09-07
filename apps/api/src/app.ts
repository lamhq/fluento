import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidateRequestBodyPipe } from './common/pipes/validate-request-body.pipe';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // auto validate request body
  app.useGlobalPipes(new ValidateRequestBodyPipe());

  return app;
}
