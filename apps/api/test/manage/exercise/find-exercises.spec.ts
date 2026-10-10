import { ObjectId } from 'mongodb';
import request from 'supertest';
import { z } from 'zod';

import { deleteMany, insertMany } from '../../utils/mongodb.js';
import { setUpApiTest } from '../../utils/test.js';

const findExercisesResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  items: z.array(
    z.object({
      id: z.string().nonempty(),
      name: z.string().nonempty(),
      skill: z.enum(['communication', 'vocabulary', 'articulation']),
      format: z.enum(['communication', 'word', 'sentence', 'paragraph']),
      topics: z.array(z.string()),
      createdAt: z.iso.datetime(),
      status: z.enum(['active', 'archived']),
    }),
  ),
});

interface Exercise {
  name?: string;
  skill?: string;
  format?: string;
  status?: string;
  topics?: string[];
  createdAt?: Date;
  userId?: ObjectId;
}

describe('find exercises', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  async function seedExercises(...items: Exercise[]) {
    await insertMany(
      'exercises',
      items.map((item) => ({
        userId: item.userId ?? getUser().id,
        status: item.status ?? 'active',
        name: item.name ?? 'Coffee Shop Order',
        skill: item.skill ?? 'communication',
        format: item.format ?? 'communication',
        topics: item.topics ?? [],
        scenario: cleanupMarker,
        prompts: ['Order a coffee.'],
        validResponses: ['I would like a coffee.'],
        createdAt: item.createdAt ?? new Date('2026-08-10T09:30:00.000Z'),
        updatedAt: new Date('2026-08-10T09:30:00.000Z'),
      })),
    );
  }

  describe('filtering', () => {
    it('should return exercises of current user', async () => {
      const { email: userEmail } = getUser();
      await seedExercises(
        { name: 'Coffee Shop Order', topics: ['Travel'] },
        { userId: new ObjectId(), name: "Another user's exercise" },
      );

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .set('x-user-email', userEmail)
        .expect(200);

      expect(resp.body).toEqual({
        total: 1,
        offset: 0,
        limit: 10,
        items: [
          {
            id: expect.any(String),
            name: 'Coffee Shop Order',
            skill: 'communication',
            format: 'communication',
            topics: ['Travel'],
            createdAt: '2026-08-10T09:30:00.000Z',
            status: 'active',
          },
        ],
      });
    });

    it('should be able to filter by multiple criteria', async () => {
      const { email: userEmail } = getUser();
      await seedExercises(
        {
          name: 'Coffee Shop',
          topics: ['Travel'],
          skill: 'communication',
          format: 'communication',
          status: 'active',
        },
        {
          name: 'Coffee Break',
          topics: ['Food'],
          skill: 'vocabulary',
          format: 'word',
          status: 'archived',
        },
        {
          name: 'Tea Shop',
          topics: ['Travel'],
          skill: 'communication',
          format: 'communication',
          status: 'active',
        },
      );

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query({
          name: 'COFFEE',
          topics: ['Travel', 'Food'],
          skills: ['communication', 'vocabulary'],
          formats: ['communication', 'word'],
          status: ['active', 'archived'],
        })
        .set('x-user-email', userEmail)
        .expect(200);

      expect(resp.body).toEqual(
        expect.objectContaining({
          total: 2,
          items: expect.arrayContaining([
            expect.objectContaining({ name: 'Coffee Break' }),
            expect.objectContaining({ name: 'Coffee Shop' }),
          ]),
        }),
      );
    });

    it('should accept single values for array filters', async () => {
      const { email: userEmail } = getUser();
      await seedExercises(
        {
          name: 'Coffee Shop',
          topics: ['Travel'],
          skill: 'communication',
          format: 'communication',
          status: 'active',
        },
        {
          name: 'Coffee Break',
          topics: ['Food'],
          skill: 'vocabulary',
          format: 'word',
          status: 'archived',
        },
      );

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query({
          topics: 'Travel',
          skills: 'communication',
          formats: 'communication',
          status: 'active',
        })
        .set('x-user-email', userEmail)
        .expect(200);

      expect(resp.body).toEqual(
        expect.objectContaining({
          total: 1,
          items: [expect.objectContaining({ name: 'Coffee Shop' })],
        }),
      );
    });

    it('should filter by name case-insensitive', async () => {
      const { email: userEmail } = getUser();
      await seedExercises({ name: 'Coffee. Shop' }, { name: 'CoffeeX Shop' });

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query({ name: 'coffee.' })
        .set('x-user-email', userEmail)
        .expect(200);

      expect(resp.body).toEqual(
        expect.objectContaining({
          items: [expect.objectContaining({ name: 'Coffee. Shop' })],
        }),
      );
    });
  });

  describe('sorting', () => {
    it('should sort by creation date ascending, then name ascending', async () => {
      const { email: userEmail } = getUser();
      await seedExercises(
        { name: 'Zulu', createdAt: new Date('2026-08-08T09:30:00.000Z') },
        { name: 'Bravo', createdAt: new Date('2026-08-10T09:30:00.000Z') },
        { name: 'Alpha', createdAt: new Date('2026-08-10T09:30:00.000Z') },
      );

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query({ sort: 'createdAt,name' })
        .set('x-user-email', userEmail)
        .expect(200);
      const response = findExercisesResponseSchema.parse(resp.body);

      expect(response.items.map((item) => item.name)).toEqual([
        'Zulu',
        'Alpha',
        'Bravo',
      ]);
    });

    it('should sort by creation date descending, then name ascending', async () => {
      const { email: userEmail } = getUser();
      await seedExercises(
        { name: 'Zulu', createdAt: new Date('2026-08-08T09:30:00.000Z') },
        { name: 'Bravo', createdAt: new Date('2026-08-10T09:30:00.000Z') },
        { name: 'Alpha', createdAt: new Date('2026-08-10T09:30:00.000Z') },
      );

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query({ sort: '-createdAt,name' })
        .set('x-user-email', userEmail)
        .expect(200);
      const response = findExercisesResponseSchema.parse(resp.body);

      expect(response.items.map((item) => item.name)).toEqual([
        'Alpha',
        'Bravo',
        'Zulu',
      ]);
    });
  });

  describe('pagination', () => {
    it('should return correct items and total count', async () => {
      const { email: userEmail } = getUser();
      await seedExercises({ name: 'Alpha' }, { name: 'Bravo' }, { name: 'Charlie' });

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query({ sort: 'name', offset: 1, limit: 1 })
        .set('x-user-email', userEmail)
        .expect(200);

      expect(resp.body).toEqual(
        expect.objectContaining({
          total: 3,
          offset: 1,
          limit: 1,
          items: [expect.objectContaining({ name: 'Bravo' })],
        }),
      );
    });
  });

  describe('edge cases', () => {
    it.each([
      [
        'unsupported status',
        { status: 'deleted' },
        { status: 'status must be one of: active, archived' },
      ],
      [
        'unsupported skill',
        { skills: 'writing' },
        {
          skills: 'skills must be one of: communication, vocabulary, articulation',
        },
      ],
      [
        'unsupported format',
        { formats: 'audio' },
        {
          formats:
            'formats must be one of: communication, word, sentence, paragraph',
        },
      ],
      [
        'unsupported sort',
        { sort: 'status' },
        {
          sort: 'sort must contain unique name and createdAt fields, optionally prefixed with -',
        },
      ],
      [
        'duplicate sort field',
        { sort: 'name,-name' },
        {
          sort: 'sort must contain unique name and createdAt fields, optionally prefixed with -',
        },
      ],
      [
        'invalid sort direction',
        { sort: 'name,asc-createdAt' },
        {
          sort: 'sort must contain unique name and createdAt fields, optionally prefixed with -',
        },
      ],
      [
        'empty sort',
        { sort: '' },
        {
          sort: 'sort must contain unique name and createdAt fields, optionally prefixed with -',
        },
      ],
      [
        'negative offset',
        { offset: '-1' },
        { offset: 'offset must be a non-negative integer' },
      ],
      ['zero limit', { limit: '0' }, { limit: 'limit must be a positive integer' }],
      [
        'non-integer limit',
        { limit: '1.5' },
        { limit: 'limit must be a positive integer' },
      ],
    ])('should return 400 error for %s', async (_label, query, details) => {
      const { email: userEmail } = getUser();

      const resp = await request(getApp().getHttpServer())
        .get('/v1/manage/exercises')
        .query(query)
        .set('x-user-email', userEmail)
        .expect(400);

      expect(resp.body).toEqual({
        code: 'invalid_request_params',
        message: 'Request validation failed',
        details,
      });
    });
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      scenario: { $regex: cleanupMarker },
    });
  });
});
