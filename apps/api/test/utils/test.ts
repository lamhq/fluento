import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';
import { ValidateRequestBodyPipe } from '../../src/common/pipes/validate-request-body.pipe';
import { connect, deleteMany, disconnect, insert } from './mongodb';

export function setUpApiTest() {
  // create a unique string for clean up db records after each test run
  const cleanupMarker = `#ApiTest-${Date.now().toString(36)}`;

  // NestJS application instance for testing
  let app!: INestApplication<App>;
  let user!: { email: string; id: string };

  beforeAll(async () => {
    // connect to database
    await connect();

    // create a test user in database
    const email = `learner-${cleanupMarker}@example.com`;
    const insertedUser = await insert('users', { email });
    user = { email, id: insertedUser._id.toString() };

    // create NestJS app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidateRequestBodyPipe());
    await app.init();
  });

  afterAll(async () => {
    // close NestJS application
    await app.close();

    // clean up database
    await deleteMany('users', { email: user.email });

    // disconnect from database
    await disconnect();
  });

  return {
    getApp: () => app,
    getUser: () => user,
    cleanupMarker,
  };
}
