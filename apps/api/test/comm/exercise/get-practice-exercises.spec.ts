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
    await insert('learner_exercise_practices', {
      userId: new Types.ObjectId(userId),
      exerciseId: new Types.ObjectId(exerciseId),
      practiceCount: 2,
      lastPracticeAt: new Date('2024-01-15T12:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
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

  it('should hide archived exercises and default to a 10-item page', async () => {
    const { email: userEmail, id: userId } = getUser();

    const exercises = Array.from({ length: 11 }, (_, index) => ({
      status: index === 0 ? 'archived' : 'active',
      topics: ['Socializing', cleanupMarker],
      scenario: `practice scenario ${index.toString()}`,
      learnerRole: 'person',
      counterpartRole: 'friend',
      prompts: ['Say hello.'],
      expectedResponses: [
        {
          content: 'Hello!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date(Date.now() + index * 1000),
      updatedAt: new Date(Date.now() + index * 1000),
    }));

    const insertedIds = await insertMany('exercises', exercises);

    for (const exerciseId of insertedIds.slice(1)) {
      await insert('learner_exercise_practices', {
        userId: new Types.ObjectId(userId),
        exerciseId: new Types.ObjectId(exerciseId),
        practiceCount: 1,
        lastPracticeAt: new Date(Date.now() + 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toHaveLength(10);
  });

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('learner_exercise_practices', {
      userId: new Types.ObjectId(userId),
    });
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
