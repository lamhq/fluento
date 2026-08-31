import request from 'supertest';

import { deleteMany, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('find exercises', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should return exercises from database', async () => {
    const { email: userEmail, id: userId } = getUser();

    await insertMany('exercises', [
      {
        userId,
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
      .get('/manage/exercises')
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          topics: expect.arrayContaining(['Socializing']),
          scenario: 'asking for a favor',
          id: expect.any(String),
        }),
      ]),
    );
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
