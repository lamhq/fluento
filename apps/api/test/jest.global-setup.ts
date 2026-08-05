// load environment variables from .env file in `api` project directory
import 'dotenv/config';

import path from 'path';
import { DockerComposeEnvironment, Wait } from 'testcontainers';

export default async function globalSetup() {
  await startMockServer();
}

async function startMockServer() {
  console.log('Starting mock services...');

  // start Docker services using docker-compose
  const composeFilePath = path.join(__dirname, '../../..');
  const composeFile = 'docker-compose.yml';

  const environment = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile,
  )
    .withWaitStrategy(
      'db-service-1',
      Wait.forLogMessage('waiting for connections'),
    )
    .withNoRecreate()
    .withAutoCleanup(false)
    .up(['db-service']);

  // initialize replica set for MongoDB
  const dbContainer = environment.getContainer('db-service-1');
  const { stdout, stderr, exitCode } = await dbContainer.exec([
    'mongo',
    'mongodb://root:password@localhost:27017/test?authSource=admin',
    '/docker-entrypoint-initdb.d/init-rs.js',
  ]);

  // const { output, stdout, stderr, exitCode } = await dbContainer.exec([
  console.log(`Command stdout: ${stdout}`);
  console.log(`Command stderr: ${stderr}`);
  console.log(`Command exit code: ${exitCode.toString()}`);

  // const logs = await dbContainer.logs();
  // logs.on('data', (line: Buffer | string) => process.stdout.write(line));
  // logs.on('err', (line: Buffer | string) => process.stderr.write(line));

  // await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds to ensure the service is up
}
