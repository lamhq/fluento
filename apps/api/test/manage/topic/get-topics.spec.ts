import request from 'supertest';
import { z } from 'zod';

import { deleteMany, insert, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

const getTopicsResponseSchema = z.array(
  z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    createdAt: z.iso.datetime(),
  }),
);

describe('get topics', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  beforeEach(async () => {
    await deleteMany('topics', {});
  });

  it('should return all topics sorted by name ascending', async () => {
    const { email: userEmail, id: userId } = getUser();

    await insertMany('topics', [
      {
        userId,
        name: 'Speaking',
        createdAt: new Date('2026-01-10T08:15:00Z'),
      },
      {
        userId,
        name: 'Communication',
        createdAt: new Date('2026-01-10T08:45:00Z'),
      },
      {
        userId,
        name: 'Grammar',
        createdAt: new Date('2026-01-10T08:30:00Z'),
      },
      {
        userId,
        name: 'Vocabulary',
        createdAt: new Date('2026-01-10T08:00:00Z'),
      },
      {
        userId: `other-user-${cleanupMarker}`,
        name: 'Secret',
        createdAt: new Date('2026-01-10T09:00:00Z'),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .set('x-user-email', userEmail)
      .expect(200);
    const topics = getTopicsResponseSchema.parse(resp.body);

    expect(topics).toHaveLength(5);
    expect(topics.map((topic) => topic.name)).toEqual([
      'Communication',
      'Grammar',
      'Secret',
      'Speaking',
      'Vocabulary',
    ]);
    expect(topics[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Communication',
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
    await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .expect(401);
  });

  it('should return topics regardless of their user', async () => {
    const { email: userEmail, id: userId } = getUser();
    const otherUser = await insert('users', {
      email: `other-${cleanupMarker}@example.com`,
    });

    await insertMany('topics', [
      {
        userId,
        name: 'Mine',
        createdAt: new Date('2026-01-10T08:00:00Z'),
      },
      {
        userId: otherUser._id,
        name: 'Theirs',
        createdAt: new Date('2026-01-10T08:10:00Z'),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .set('x-user-email', userEmail)
      .expect(200);
    const topics = getTopicsResponseSchema.parse(resp.body);

    expect(topics).toHaveLength(2);
    expect(topics.map((topic) => topic.name)).toEqual(['Mine', 'Theirs']);
  });
});
