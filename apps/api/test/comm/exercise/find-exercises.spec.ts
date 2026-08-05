import request from 'supertest';

import { insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('find exercises', () => {
  const { cleanupMarker, getApp } = setUpApiTest();

  it('should return exercises from database', async () => {
    await insertMany('exercises', [
      {
        topics: ['Socializing', cleanupMarker],
        scenario: 'asking for a favor',
        learnerRole: 'person',
        counterpartRole: 'friend',
        prompts: ['Politely ask your friend to take you to the airport.'],
        expectedResponses: [
          {
            content: 'I was hoping you could give me a lift to the airport.',
            style: ['polite', 'courteous'],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/exercises')
      .expect(200);

    expect(resp.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          topics: expect.arrayContaining(['Socializing']),
          scenario: 'asking for a favor',
        }),
      ]),
    );
  });
});
