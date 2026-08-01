import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';
import { connect, deleteMany, disconnect } from './mongodb';

export function setUpApiTest() {
  // create a unique string for clean up db records after each test run
  const cleanupMarker = `#ApiTest-${Date.now().toString()}`;

  // NestJS application instance for testing
  let app!: INestApplication<App>;

  beforeAll(async () => {
    await connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  afterEach(async () => {
    await deleteMany('exercises', { name: { $regex: cleanupMarker } });
  });

  return {
    getApp: () => app,
    cleanupMarker,
  };
}
