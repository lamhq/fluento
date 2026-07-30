import { ConfigService } from '@nestjs/config';

import { createNestApp } from './app';

async function bootstrap() {
  const app = await createNestApp();
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  await app.listen(port);
}

void bootstrap();
