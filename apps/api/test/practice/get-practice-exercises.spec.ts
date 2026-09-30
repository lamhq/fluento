import request from 'supertest';
import { z } from 'zod';

import { deleteMany, insertMany } from '../utils/mongodb';
import { setUpApiTest } from '../utils/test';

const exerciseBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  topics: z.array(z.string()),
  references: z.array(z.string()),
  practicedAt: z.iso.datetime().nullable().optional(),
  practiceCount: z.number().int().nonnegative(),
});

const exerciseSchema = z.discriminatedUnion('format', [
  exerciseBaseSchema.extend({
    skill: z.literal('communication'),
    format: z.literal('communication'),
    scenario: z.string(),
    prompts: z.array(z.string()),
  }),
  exerciseBaseSchema.extend({
    skill: z.literal('vocabulary'),
    format: z.literal('word'),
    word: z.string(),
    meaning: z.string(),
    clues: z.array(z.string()),
    sentences: z.array(z.string()),
  }),
  exerciseBaseSchema.extend({
    skill: z.literal('articulation'),
    format: z.literal('sentence'),
    scenario: z.string(),
    words: z.array(z.string()),
    sentence: z.string(),
  }),
  exerciseBaseSchema.extend({
    skill: z.literal('articulation'),
    format: z.literal('paragraph'),
    scenario: z.string(),
    prompts: z.array(z.string()),
    paragraph: z.string(),
    words: z.array(z.string()),
  }),
]);

const paginatedExercisesSchema = z.object({
  items: z.array(exerciseSchema),
  nextCursor: z.string().nullable(),
  previousCursor: z.string().nullable(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

describe('find practice exercises', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should only return active exercises', async () => {
    const { email: userEmail, id: userId } = getUser();

    await insertMany('exercises', [
      {
        status: 'active',
        userId,
        topics: ['Socializing', cleanupMarker],
        scenario: 'active practice one',
        name: 'Active practice one',
        skill: 'communication',
        format: 'communication',
        references: [],
        prompts: ['Say hello.'],
        validResponses: ['Hello!'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'archived',
        userId,
        topics: ['Socializing', cleanupMarker],
        scenario: 'archived practice',
        name: 'Archived practice',
        skill: 'communication',
        format: 'communication',
        references: [],
        prompts: ['Say hello.'],
        validResponses: ['Hello!'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .set('Accept', 'application/json')
      .expect(200);

    const response = paginatedExercisesSchema.parse(resp.body);

    expect(response.items).toHaveLength(1);
  });

  it('should return correct exercise data', async () => {
    const { email: userEmail, id: userId } = getUser();

    await insertMany('exercises', [
      {
        userId,
        name: 'Small talk',
        skill: 'communication',
        format: 'communication',
        status: 'active',
        topics: ['Everyday Conversation', cleanupMarker],
        scenario: 'Answer small talk questions',
        prompts: ['What are you up to this weekend?'],
        references: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId,
        name: 'customs',
        skill: 'vocabulary',
        format: 'word',
        status: 'active',
        topics: ['Airport', cleanupMarker],
        word: 'customs',
        meaning: 'The official procedures required when entering a country.',
        sentences: ['At customs, they will check your passport.'],
        clues: ['passport', 'inspection'],
        references: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId,
        name: 'Talk about your background',
        skill: 'articulation',
        format: 'sentence',
        status: 'active',
        topics: ['Job Interview', cleanupMarker],
        scenario: 'Describe your background',
        words: ['study', 'computer science', 'university', "bachelor's degree"],
        sentence:
          "I studied computer science at university and had a bachelor's degree.",
        references: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId,
        name: 'Festival introduction',
        skill: 'articulation',
        format: 'paragraph',
        status: 'active',
        topics: ['Mid-Autumn Festival', cleanupMarker],
        scenario: 'Mid-Autumn Festival Introduction',
        prompts: ['Read and practice the paragraph.'],
        paragraph: 'The festival brings families together.',
        words: ['festival', 'family reunion'],
        references: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ limit: 10 })
      .set('x-user-email', userEmail)
      .set('Accept', 'application/json')
      .expect(200);

    const response = paginatedExercisesSchema.parse(resp.body);

    expect(response.items).toHaveLength(4);
    expect(response.items.map((item) => item.format)).toEqual(
      expect.arrayContaining([
        'communication',
        'word',
        'sentence',
        'paragraph',
      ]),
    );
  });

  it('should filter exercises by requested topic', async () => {
    const { email: userEmail, id: userId } = getUser();

    await insertMany('exercises', [
      {
        userId,
        name: 'Restaurant conversation',
        skill: 'communication',
        format: 'communication',
        status: 'active',
        topics: ['Restaurant', cleanupMarker],
        scenario: 'Order a meal at a restaurant',
        references: [],
        prompts: ['Order a meal.'],
        validResponses: ['I would like a meal.'],
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date(),
      },
      {
        userId,
        name: 'School conversation',
        skill: 'communication',
        format: 'communication',
        status: 'active',
        topics: ['School', cleanupMarker],
        references: [],
        prompts: ['Ask about class.'],
        validResponses: ['How was class?'],
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        updatedAt: new Date(),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get('/v1/practice/exercises')
      .query({ topics: ['Restaurant'], limit: 10 })
      .set('x-user-email', userEmail)
      .set('Accept', 'application/json')
      .expect(200);

    const response = paginatedExercisesSchema.parse(resp.body);

    expect(response.items).toHaveLength(1);
    expect(response.items[0].topics).toEqual(
      expect.arrayContaining(['Restaurant']),
    );
  });

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('learner_exercise_progress', {
      userId,
    });
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
