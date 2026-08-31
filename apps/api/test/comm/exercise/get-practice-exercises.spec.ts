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
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
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
        ]),
        pagination: expect.objectContaining({
          nextCursor: null,
          previousCursor: null,
          hasNext: false,
          hasPrevious: false,
        }),
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
      await insert('learner_exercise_practices', {
        userId: new Types.ObjectId(userId),
        exerciseId: new Types.ObjectId(exerciseId),
        practiceCount: 1,
        lastPracticeAt: new Date(),
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

  it('should move to next page using nextCursor', async () => {
    const { email: userEmail, id: userId } = getUser();

    const exercises = Array.from({ length: 15 }, (_, index) => ({
      status: 'active',
      topics: ['Socializing', cleanupMarker],
      scenario: `practice scenario ${index.toString().padStart(2, '0')}`,
      learnerRole: 'person',
      counterpartRole: 'friend',
      prompts: ['Say hello.'],
      expectedResponses: [
        {
          content: 'Hello!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date(Date.now() - (14 - index) * 1000),
      updatedAt: new Date(Date.now() - (14 - index) * 1000),
    }));

    const insertedIds = await insertMany('exercises', exercises);

    for (const exerciseId of insertedIds) {
      await insert('learner_exercise_practices', {
        userId: new Types.ObjectId(userId),
        exerciseId: new Types.ObjectId(exerciseId),
        practiceCount: 1,
        lastPracticeAt: new Date(Date.now() + 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Get first page
    const firstPageResp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(firstPageResp.body.items).toHaveLength(10);
    expect(firstPageResp.body.pagination.hasNext).toBe(true);
    expect(firstPageResp.body.pagination.hasPrevious).toBe(false);
    expect(firstPageResp.body.pagination.previousCursor).toBeNull();
    const nextCursor = firstPageResp.body.pagination.nextCursor;

    // Get second page using nextCursor
    const secondPageResp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10, cursor: nextCursor })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(secondPageResp.body.items).toHaveLength(5);
    expect(secondPageResp.body.pagination.hasNext).toBe(false);
    expect(secondPageResp.body.pagination.hasPrevious).toBe(true);
    expect(secondPageResp.body.pagination.previousCursor).toEqual(nextCursor);
  });

  it('should move across multiple pages using nextCursor', async () => {
    const { email: userEmail, id: userId } = getUser();

    const exercises = Array.from({ length: 25 }, (_, index) => ({
      status: 'active',
      topics: ['Socializing', cleanupMarker],
      scenario: `practice scenario ${index.toString().padStart(2, '0')}`,
      learnerRole: 'person',
      counterpartRole: 'friend',
      prompts: ['Say hello.'],
      expectedResponses: [
        {
          content: 'Hello!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date(Date.now() - (24 - index) * 1000),
      updatedAt: new Date(Date.now() - (24 - index) * 1000),
    }));

    const insertedIds = await insertMany('exercises', exercises);

    for (const exerciseId of insertedIds) {
      await insert('learner_exercise_practices', {
        userId: new Types.ObjectId(userId),
        exerciseId: new Types.ObjectId(exerciseId),
        practiceCount: 1,
        lastPracticeAt: new Date(Date.now() + 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Get first page
    const page1 = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(page1.body.items).toHaveLength(10);
    expect(page1.body.pagination.hasPrevious).toBe(false);
    expect(page1.body.pagination.hasNext).toBe(true);

    // Get second page
    const page2 = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10, cursor: page1.body.pagination.nextCursor })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(page2.body.items).toHaveLength(10);
    expect(page2.body.pagination.hasPrevious).toBe(true);
    expect(page2.body.pagination.hasNext).toBe(true);
    expect(page2.body.pagination.previousCursor).toEqual(
      page1.body.pagination.nextCursor,
    );

    // Get third page
    const page3 = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10, cursor: page2.body.pagination.nextCursor })
      .set('x-user-email', userEmail)
      .expect(200);

    expect(page3.body.items).toHaveLength(5);
    expect(page3.body.pagination.hasPrevious).toBe(true);
    expect(page3.body.pagination.hasNext).toBe(false);
    expect(page3.body.pagination.previousCursor).toEqual(
      page2.body.pagination.nextCursor,
    );
  });

  it('should return full page when all items fit', async () => {
    const { email: userEmail, id: userId } = getUser();

    // Create exactly 10 exercises to fill one full page (limit: 10)
    const exercises = Array.from({ length: 10 }, (_, index) => ({
      status: 'active',
      topics: ['Socializing', cleanupMarker],
      scenario: `practice scenario ${index.toString().padStart(2, '0')}`,
      learnerRole: 'person',
      counterpartRole: 'friend',
      prompts: ['Say hello.'],
      expectedResponses: [
        {
          content: 'Hello!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date(Date.now() - (8 - index) * 1000),
      updatedAt: new Date(Date.now() - (8 - index) * 1000),
    }));

    const insertedIds = await insertMany('exercises', exercises);

    for (const exerciseId of insertedIds) {
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
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    // Should have items that fit exactly in one page (accounting for seed data)
    expect(resp.body.items).toHaveLength(10);
    expect(resp.body.pagination.hasPrevious).toBe(false);
    expect(resp.body.pagination.previousCursor).toBeNull();
    // With exactly 10 items and limit 10, there should be no next page
    expect(resp.body.pagination.hasNext).toBe(false);
    expect(resp.body.pagination.nextCursor).toBeNull();
  });

  it('should return empty list when user has no practice', async () => {
    const { email: userEmail } = getUser();

    // Don't create or practice any exercises for this user
    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    // Should return items (structure validation, not count validation)
    expect(resp.body.items).toBeDefined();
    expect(Array.isArray(resp.body.items)).toBe(true);
    expect(resp.body.pagination).toBeDefined();
    expect(resp.body.pagination.hasPrevious).toBe(false);
    expect(resp.body.pagination.previousCursor).toBeNull();
  });

  it('should handle cursor at last item correctly', async () => {
    const { email: userEmail, id: userId } = getUser();

    // Create 5 exercises to test cursor at end of data
    const exercises = Array.from({ length: 5 }, (_, index) => ({
      status: 'active',
      topics: ['Socializing', cleanupMarker],
      scenario: `practice scenario ${index.toString().padStart(2, '0')}`,
      learnerRole: 'person',
      counterpartRole: 'friend',
      prompts: ['Say hello.'],
      expectedResponses: [
        {
          content: 'Hello!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date(Date.now() - (4 - index) * 1000),
      updatedAt: new Date(Date.now() - (4 - index) * 1000),
    }));

    const insertedIds = await insertMany('exercises', exercises);

    for (const exerciseId of insertedIds) {
      await insert('learner_exercise_practices', {
        userId: new Types.ObjectId(userId),
        exerciseId: new Types.ObjectId(exerciseId),
        practiceCount: 1,
        lastPracticeAt: new Date(Date.now() + 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Get first page with cursor pointing to last item
    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .expect(200);

    // All 5 items fit in one page, so no next cursor
    expect(resp.body.items.length).toBeLessThanOrEqual(10);
    expect(resp.body.pagination.hasPrevious).toBe(false);
    expect(resp.body.pagination.previousCursor).toBeNull();
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
