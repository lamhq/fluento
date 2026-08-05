import serverlessExpress from '@codegenie/serverless-express';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { RequestListener } from 'http';

import { createNestApp } from './app';

let server: APIGatewayProxyHandler | undefined;

async function bootstrap(): Promise<APIGatewayProxyHandler> {
  const app = await createNestApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as RequestListener;
  return serverlessExpress({ app: expressApp });
}

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback,
) => {
  server = server ?? (await bootstrap());
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return server(event, context, callback) as Promise<APIGatewayProxyResult>;
};
