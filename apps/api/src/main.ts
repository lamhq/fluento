import { getNestApp } from './app';

async function bootstrap() {
  const app = await getNestApp();
  await app.listen(process.env.PORT ?? 5600);
}

void bootstrap();
