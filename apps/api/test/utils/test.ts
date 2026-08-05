import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';
import { ValidateRequestBodyPipe } from '../../src/common/pipes/validate-request-body.pipe';
import { connect, deleteMany, disconnect } from './mongodb';

export function setUpApiTest() {
  // create a unique string for clean up db records after each test run
  const cleanupMarker = `#ApiTest-${Date.now().toString(36)}`;

  // NestJS application instance for testing
  let app!: INestApplication<App>;

  beforeAll(async () => {
    await connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // auto validate request body
    app.useGlobalPipes(new ValidateRequestBodyPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });

  return {
    getApp: () => app,
    cleanupMarker,
  };
}
