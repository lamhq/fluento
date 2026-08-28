import { Types } from 'mongoose';
import request from 'supertest';

import { deleteMany, insert, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('find practice exercises', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should return learner practice exercises for the current user', async () => {
    const { email: userEmail, id: userId } = getUser();

    const [exerciseId] = await insertMany('exercises', [
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
    await insert('learner_exercise_practices', {
      learnerId: new Types.ObjectId(userId),
      exerciseId: new Types.ObjectId(exerciseId),
      practiceCount: 2,
      lastPracticeAt: new Date('2024-01-15T12:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const resp = await request(getApp().getHttpServer())
      .get('/practice/exercises')
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: exerciseId,
          topics: expect.arrayContaining(['Socializing', cleanupMarker]),
          scenario: 'asking for a favor',
          practiceCount: 2,
          lastPracticeAt: expect.any(String),
        }),
      ]),
    );
  });

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('learner_exercise_practices', {
      learnerId: new Types.ObjectId(userId),
    });
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
