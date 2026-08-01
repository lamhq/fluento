import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';

import { AppModule } from '../../../src/app.module';
import { connect, deleteMany, disconnect } from '../../utils/mongodb';

export const deleteMarker = '#TestExercise';

export function setupExerciseCrudTests() {
  let app!: INestApplication<App>;

  beforeAll(async () => {
    await connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await deleteMany('exercises', { name: { $regex: deleteMarker } });
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  return () => app;
}
