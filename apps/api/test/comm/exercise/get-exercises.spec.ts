import request from 'supertest';

import { deleteMany, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('find exercises', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should return a paginated exercise list from the database', async () => {
    const { email: userEmail, id: userId } = getUser();

    await insertMany('exercises', [
      {
        userId,
        status: 'active',
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
      .get('/v1/manage/exercises')
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        offset: 0,
        limit: 10,
        items: expect.arrayContaining([
          expect.objectContaining({
            topics: expect.arrayContaining(['Socializing']),
            scenario: 'asking for a favor',
            status: 'active',
            id: expect.any(String),
            learnerRole: 'person',
            counterpartRole: 'friend',
          }),
        ]),
      }),
    );
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
