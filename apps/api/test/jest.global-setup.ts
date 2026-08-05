// load environment variables from .env file in `api` project directory
import 'dotenv/config';

import path from 'path';
import { GenericContainer, Wait } from 'testcontainers';

import deferred from './utils/deferred';

export default async function startMongoDB() {
  console.log(`Start MongoDB`);

  const container = await new GenericContainer('mongo:4.2')
    .withEnvironment({
      MONGO_INITDB_ROOT_USERNAME: 'admin',
      MONGO_INITDB_ROOT_PASSWORD: '123123',
      MONGO_INITDB_DATABASE: 'test',
    })
    .withExposedPorts({
      host: 27017,
      container: 27017,
    })
    .withCopyFilesToContainer([
      {
        source: path.resolve(__dirname, '../../db/init-rs.js'),
        target: '/docker-entrypoint-initdb.d/init-rs.js',
      },
    ])
    .withWaitStrategy(Wait.forLogMessage('waiting for connections'))
    .withCommand(['--replSet', 'rs0', '--bind_ip_all'])
    .start();

  // Initialize replica set and wait until it is ready
  const {
    promise: rsPromise,
    resolve: resolveRs,
    reject: rejectRs,
  } = deferred<undefined>();
  const logStream = await container.logs();
  logStream
    .on('data', (line) => {
      if (typeof line !== 'string') return;

      if (line.includes('waiting for connections')) {
        // Initialize replica set for MongoDB
        console.log(`Initialize replica set`);
        void container.exec([
          'mongo',
          'mongodb://admin:123123@localhost:27017/test?authSource=admin&directConnection=true',
          '/docker-entrypoint-initdb.d/init-rs.js',
        ]);
      } else if (line.includes('database writes are now permitted')) {
        console.log(`Replica set is ready`);
        resolveRs(undefined);
      }
    })
    .on('error', (line) => {
      console.error(line);
      rejectRs(new Error('Replica set initialization failed'));
    });
  return rsPromise;
}
