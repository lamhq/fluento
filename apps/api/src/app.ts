import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

export async function getNestApp() {
  const app = await NestFactory.create(AppModule);
  return app;
}
