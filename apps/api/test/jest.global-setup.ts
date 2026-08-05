// load environment variables from .env file in `api` project directory
import 'dotenv/config';

import { MongoDBContainer } from '@testcontainers/mongodb';
// import { Wait } from 'testcontainers';

export default async function globalSetup() {
  await startMockServer();
}

async function startMockServer() {
  const container = await new MongoDBContainer('mongo:4.2')
    .withUsername('admin')
    .withPassword('123123')
    .withExposedPorts(27017)
    .withCommand(['--replSet', 'rs0', '--bind_ip_all'])
    // .withWaitStrategy(Wait.forLogMessage('waiting for connections'))
    .start();
  console.log(`MongoDB connection string: ${container.getConnectionString()}`);
}
