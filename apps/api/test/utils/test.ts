import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { App } from 'supertest/types.js';

import { AppModule } from '../../src/app.module.js';
import { ExceptionFilter } from '../../src/common/error/exception.filter.js';
import { SchemaValidationPipe } from '../../src/common/error/schema-validation.pipe.js';
import { connect, deleteMany, disconnect, insert } from './mongodb.js';

export function setUpApiTest() {
  // NestJS application instance for testing
  let app!: INestApplication<App>;
  const user = {
    id: new ObjectId(),
    email: 'learner@example.com',
  };

  beforeAll(async () => {
    // connect to database
    await connect();

    // create a test user in database
    await insert('users', { _id: user.id, email: user.email });

    // create NestJS app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });
    app.useGlobalPipes(new SchemaValidationPipe());
    app.useGlobalFilters(new ExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    // close NestJS application
    await app.close();

    // remove test user
    await deleteMany('users', { email: user.email });

    // disconnect from database
    await disconnect();
  });

  return {
    getApp: () => app,
    getUser: () => user,
  };
}
