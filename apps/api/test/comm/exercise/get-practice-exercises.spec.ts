/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Types } from 'mongoose';
import request from 'supertest';

import { deleteMany, insert, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('find practice exercises', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should return exercises of current user', async () => {
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
    await insert('exercise_practices', {
      userId,
      exerciseId: new Types.ObjectId(exerciseId),
      practiceCount: 2,
      practicedAt: new Date('2024-01-15T12:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            id: exerciseId,
            topics: expect.arrayContaining(['Socializing', cleanupMarker]),
            scenario: 'asking for a favor',
            practicedAt: expect.any(String),
            practiceCount: 2,
            learnerRole: 'person',
            counterpartRole: 'friend',
            prompts: expect.arrayContaining([
              'Politely ask your friend to take you to the airport.',
            ]),
            expectedResponses: expect.arrayContaining([
              expect.objectContaining({
                content:
                  'I was hoping you could give me a lift to the airport.',
                style: expect.arrayContaining(['polite', 'courteous']),
              }),
            ]),
          }),
        ],
        nextCursor: null,
        previousCursor: null,
        hasNext: false,
        hasPrevious: false,
      }),
    );
  });

  it('should exclude archived exercises', async () => {
    const { email: userEmail, id: userId } = getUser();

    const activeExerciseIds = await insertMany('exercises', [
      {
        status: 'active',
        topics: ['Socializing', cleanupMarker],
        scenario: 'active practice one',
        learnerRole: 'person',
        counterpartRole: 'friend',
        prompts: ['Say hello.'],
        expectedResponses: [{ content: 'Hello!', style: ['friendly'] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'active',
        topics: ['Socializing', cleanupMarker],
        scenario: 'active practice two',
        learnerRole: 'person',
        counterpartRole: 'friend',
        prompts: ['Say hello.'],
        expectedResponses: [{ content: 'Hello!', style: ['friendly'] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const archivedExerciseId = await insert('exercises', {
      status: 'archived',
      topics: ['Socializing', cleanupMarker],
      scenario: 'archived practice',
      learnerRole: 'person',
      counterpartRole: 'friend',
      prompts: ['Say hello.'],
      expectedResponses: [{ content: 'Hello!', style: ['friendly'] }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const exerciseId of activeExerciseIds) {
      await insert('exercise_practices', {
        userId,
        exerciseId: new Types.ObjectId(exerciseId),
        practiceCount: 1,
        practicedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body.items).toHaveLength(2);
    expect(
      resp.body.items.every(
        (item: { id: string }) => item.id !== archivedExerciseId._id.toString(),
      ),
    ).toBe(true);
    expect(
      resp.body.items.map((item: { status?: string }) => item.status),
    ).not.toContain('archived');
  });

  it('should return empty list when user has no practice', async () => {
    const { email: userEmail } = getUser();

    // Don't create or practice any exercises for this user
    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body.items).toEqual([]);
  });

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('exercise_practices', {
      userId,
    });
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
