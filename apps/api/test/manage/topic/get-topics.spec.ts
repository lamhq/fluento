import { ObjectId } from 'mongodb';
import request from 'supertest';
import { z } from 'zod';

import { deleteMany, insertMany } from '../../utils/mongodb.js';
import { setUpApiTest } from '../../utils/test.js';

const getTopicsResponseSchema = z.array(
  z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    createdAt: z.iso.datetime(),
  }),
);

describe('get topics', () => {
  const { getApp, getUser } = setUpApiTest();
  const otherUserId = new ObjectId();

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('topics', { userId });
    await deleteMany('topics', { userId: otherUserId });
    await deleteMany('users', { _id: otherUserId });
  });

  it("should return public topics and the current user's topics sorted by name ascending", async () => {
    const { email: userEmail, id: userId } = getUser();
    await insertMany('topics', [
      {
        userId,
        name: 'Speaking',
        visibility: 'private',
        createdAt: new Date('2026-01-10T08:15:00Z'),
      },
      {
        userId,
        name: 'Communication',
        visibility: 'private',
        createdAt: new Date('2026-01-10T08:45:00Z'),
      },
      {
        userId,
        name: 'Grammar',
        visibility: 'private',
        createdAt: new Date('2026-01-10T08:30:00Z'),
      },
      {
        userId,
        name: 'Vocabulary',
        visibility: 'private',
        createdAt: new Date('2026-01-10T08:00:00Z'),
      },
      {
        userId: otherUserId,
        name: 'Secret',
        visibility: 'private',
        createdAt: new Date('2026-01-10T09:00:00Z'),
      },
      {
        userId: otherUserId,
        name: 'Airport',
        visibility: 'public',
        createdAt: new Date('2026-01-10T07:00:00Z'),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .set('x-user-email', userEmail)
      .expect(200);
    const topics = getTopicsResponseSchema.parse(resp.body);

    expect(topics).toHaveLength(5);
    expect(topics.map((topic) => topic.name)).toEqual([
      'Airport',
      'Communication',
      'Grammar',
      'Speaking',
      'Vocabulary',
    ]);
    expect(topics[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Airport',
        createdAt: expect.any(String),
      }),
    );
  });

  it('should return an empty array when the user has no topics', async () => {
    const { email: userEmail } = getUser();

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .set('x-user-email', userEmail)
      .expect(200);

    expect(getTopicsResponseSchema.parse(resp.body)).toEqual([]);
  });

  it('should reject unauthenticated requests', async () => {
    await request(getApp().getHttpServer()).get('/v1/practice/topics').expect(401);
  });
});
