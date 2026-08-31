/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import request from 'supertest';

import { deleteMany, insert, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('get topics', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  beforeEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('topics', { userId });
  });

  it('should return topics for the current user sorted by name ascending', async () => {
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

    expect(resp.body).toHaveLength(4);
    expect(resp.body.map((topic: { name: string }) => topic.name)).toEqual([
      'Communication',
      'Grammar',
      'Speaking',
      'Vocabulary',
    ]);
    expect(resp.body[0]).toEqual(
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

    expect(resp.body).toEqual([]);
  });

  it('should reject unauthenticated requests', async () => {
    await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .expect(401);
  });

  it("should not allow users to view another user's topics", async () => {
    const { email: userEmail, id: userId } = getUser();
    const otherUser = await insert('users', {
      email: `other-${cleanupMarker}@example.com`,
    });

    await insertMany('topics', [
      { userId, name: 'Mine', createdAt: new Date('2026-01-10T08:00:00Z') },
      {
        userId: otherUser._id.toString(),
        name: 'Theirs',
        createdAt: new Date('2026-01-10T08:10:00Z'),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/topics')
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual([
      expect.objectContaining({
        name: 'Mine',
        id: expect.any(String),
        createdAt: expect.any(String),
      }),
    ]);
    expect(resp.body.map((topic: { name: string }) => topic.name)).toEqual([
      'Mine',
    ]);
  });
});
