// load environment variables from .env file in `api` project directory
import 'dotenv/config';

import path from 'path';
import { GenericContainer, Wait } from 'testcontainers';

export default async function globalSetup() {
  await startMockServer();
}

async function startMockServer() {
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
    .withWaitStrategy(Wait.forLogMessage('waiting for connection'))
    // .withAutoCleanup(false)
    .withCommand(['--replSet', 'rs0', '--bind_ip_all'])
    // .withLogConsumer((stream) => {
    //   stream.on('data', (line) => {
    //     console.log(line);
    //   });
    //   stream.on('err', (line) => {
    //     console.error(line);
    //   });
    //   stream.on('end', () => {
    //     console.log('Stream closed');
    //   });
    // })
    .start();

  // initialize replica set for MongoDB
  await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for MongoDB to start
  await container.exec([
    'mongo',
    'mongodb://admin:123123@localhost:27017/test?authSource=admin&directConnection=true',
    '/docker-entrypoint-initdb.d/init-rs.js',
  ]);
  // const { stdout, stderr, exitCode } = await container.exec([
  // console.log(`Command stdout: ${stdout}`);
  // console.log(`Command stderr: ${stderr}`);
  // console.log(`Command exit code: ${exitCode.toString()}`);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for replica set to initialize
  // // const { output, stdout, stderr, exitCode } = await dbContainer.exec([
}
