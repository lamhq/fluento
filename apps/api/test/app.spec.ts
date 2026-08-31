import request from 'supertest';

import { setUpApiTest } from './utils/test';

describe('AppController (e2e)', () => {
  const { getApp } = setUpApiTest();

  it('/ (GET)', () => {
    return request(getApp().getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
