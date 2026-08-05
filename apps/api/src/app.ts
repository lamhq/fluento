import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidateRequestBodyPipe } from './common/pipes/validate-request-body.pipe';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  // auto validate request body
  app.useGlobalPipes(new ValidateRequestBodyPipe());

  return app;
}
