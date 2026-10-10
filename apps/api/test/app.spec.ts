import request from 'supertest';

import { setUpApiTest } from './utils/test.js';

describe('AppController (e2e)', () => {
  const { getApp } = setUpApiTest();

  it('/ (GET)', () => {
    return request(getApp().getHttpServer())
      .get('/v1/')
      .expect(200)
      .expect('Hello World!');
  });
});
