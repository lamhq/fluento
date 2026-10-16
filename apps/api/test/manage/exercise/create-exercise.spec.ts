import request from 'supertest';

import { ExerciseService } from '../../../src/content/core/exercise.service.js';
import { deleteMany, findAll, findById } from '../../utils/mongodb.js';
import { setUpApiTest } from '../../utils/test.js';
import { createExerciseResponseSchema } from './create-exercise.schema.js';

describe('create exercise', () => {
  const { getApp, getUser } = setUpApiTest();

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('exercises', { userId });
  });

  describe('happy cases', () => {
    it.each([
      // Creates a communication exercise with required prompt and response lists.
      {
        request: {
          format: 'communication',
          topics: ['Test topic'],
          status: 'archived',
          scenario: 'Order a meal at a restaurant.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like the grilled salmon, please.'],
        },
        expectedName: 'Order a meal at a restaurant.',
        expectedSkill: 'communication',
      },
      // Creates a vocabulary exercise with word, meaning, sentences, and clues.
      {
        request: {
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
          word: 'serendipity',
          meaning: 'Finding something valuable by chance.',
          sentences: ['We met by serendipity.'],
          clues: ['An unexpected fortunate discovery.'],
        },
        expectedName: 'serendipity',
        expectedSkill: 'vocabulary',
      },
      // Creates an articulation sentence exercise.
      {
        request: {
          format: 'sentence',
          topics: ['Test topic'],
          status: 'active',
          scenario: 'Practice saying the sentence clearly.',
          sentence: 'The quick brown fox jumps over the lazy dog.',
          words: ['quick', 'lazy'],
        },
        expectedName: 'Practice saying the sentence clearly.',
        expectedSkill: 'articulation',
      },
      // Creates an articulation paragraph exercise.
      {
        request: {
          format: 'paragraph',
          topics: ['Test topic'],
          status: 'active',
          scenario: 'Practice reading the paragraph aloud.',
          paragraph: 'A short paragraph for articulation practice.',
          words: ['articulation', 'practice'],
        },
        expectedName: 'Practice reading the paragraph aloud.',
        expectedSkill: 'articulation',
      },
    ])(
      'should create $request.format exercise (TC_API_CE_01)',
      async ({ request: requestBody, expectedName, expectedSkill }) => {
        const { id: userId, email } = getUser();

        const response = await request(getApp().getHttpServer())
          .post('/v1/manage/exercises')
          .set('x-user-email', email)
          .send(requestBody)
          .expect(201);

        const exercise = createExerciseResponseSchema.parse(response.body);
        expect(exercise).toEqual({
          id: expect.any(String),
          name: expectedName,
          skill: expectedSkill,
          format: requestBody.format,
          topics: requestBody.topics,
          createdAt: expect.any(String),
          status: requestBody.status,
        });

        const saved = await findById('exercises', exercise.id);
        expect(saved).toEqual(
          expect.objectContaining({
            ...requestBody,
            skill: expectedSkill,
            name: expectedName,
            userId,
          }),
        );
      },
    );
  });

  describe('unauthenticated', () => {
    it('should reject unauthenticated requests (TC_API_CE_02)', async () => {
      const { id: userId } = getUser();
      const name = `${userId.toHexString()} unauthenticated`;
      const body = {
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: name,
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
      };

      await request(getApp().getHttpServer())
        .post('/v1/manage/exercises')
        .send(body)
        .expect(401);

      expect(await findAll('exercises', { name })).toHaveLength(0);
    });
  });

  describe('normalize field values', () => {
    it.each([
      {
        request: {
          format: 'communication',
          topics: ['  Cafe  ', ' ', 'Restaurant  '],
          status: 'active',
          references: ['  https://example.test/source  ', ' '],
          scenario: '  normalized communication  ',
          prompts: ['  Ask to order.  ', ' ', ''],
          validResponses: ['  I would like tea.  ', ' '],
        },
        response: {
          id: expect.any(String),
          name: 'normalized communication',
          skill: 'communication',
          format: 'communication',
          topics: ['Cafe', 'Restaurant'],
          createdAt: expect.any(String),
          status: 'active',
        },
        saved: {
          format: 'communication',
          status: 'active',
          name: 'normalized communication',
          skill: 'communication',
          topics: ['Cafe', 'Restaurant'],
          references: ['https://example.test/source'],
          scenario: 'normalized communication',
          prompts: ['Ask to order.'],
          validResponses: ['I would like tea.'],
        },
      },
      {
        request: {
          format: 'word',
          topics: ['  Cafe  ', ' ', 'Restaurant  '],
          status: 'active',
          references: ['  https://example.test/source  ', ' '],
          word: '  normalized word  ',
          meaning: '  Finding something valuable by chance.  ',
          sentences: ['  We met by serendipity.  ', ' '],
          clues: ['  An unexpected fortunate discovery.  ', ''],
        },
        response: {
          id: expect.any(String),
          name: 'normalized word',
          skill: 'vocabulary',
          format: 'word',
          topics: ['Cafe', 'Restaurant'],
          createdAt: expect.any(String),
          status: 'active',
        },
        saved: {
          format: 'word',
          status: 'active',
          name: 'normalized word',
          skill: 'vocabulary',
          topics: ['Cafe', 'Restaurant'],
          references: ['https://example.test/source'],
          word: 'normalized word',
          meaning: 'Finding something valuable by chance.',
          sentences: ['We met by serendipity.'],
          clues: ['An unexpected fortunate discovery.'],
        },
      },
      {
        request: {
          format: 'sentence',
          topics: ['  Cafe  ', ' ', 'Restaurant  '],
          status: 'active',
          references: ['  https://example.test/source  ', ' '],
          scenario: '  normalized sentence  ',
          sentence: '  The quick brown fox jumps over the lazy dog.  ',
          words: ['  quick  ', ' ', ' lazy '],
        },
        response: {
          id: expect.any(String),
          name: 'normalized sentence',
          skill: 'articulation',
          format: 'sentence',
          topics: ['Cafe', 'Restaurant'],
          createdAt: expect.any(String),
          status: 'active',
        },
        saved: {
          format: 'sentence',
          status: 'active',
          name: 'normalized sentence',
          skill: 'articulation',
          topics: ['Cafe', 'Restaurant'],
          references: ['https://example.test/source'],
          scenario: 'normalized sentence',
          sentence: 'The quick brown fox jumps over the lazy dog.',
          words: ['quick', 'lazy'],
        },
      },
      {
        request: {
          format: 'paragraph',
          topics: ['  Cafe  ', ' ', 'Restaurant  '],
          status: 'active',
          references: ['  https://example.test/source  ', ' '],
          scenario: '  normalized paragraph  ',
          paragraph: '  A short paragraph for articulation practice.  ',
          words: ['  articulation  ', '', ' practice '],
        },
        response: {
          id: expect.any(String),
          name: 'normalized paragraph',
          skill: 'articulation',
          format: 'paragraph',
          topics: ['Cafe', 'Restaurant'],
          createdAt: expect.any(String),
          status: 'active',
        },
        saved: {
          format: 'paragraph',
          status: 'active',
          name: 'normalized paragraph',
          skill: 'articulation',
          topics: ['Cafe', 'Restaurant'],
          references: ['https://example.test/source'],
          scenario: 'normalized paragraph',
          paragraph: 'A short paragraph for articulation practice.',
          words: ['articulation', 'practice'],
        },
      },
    ])(
      'should normalize $request.format fields (TC_API_CE_03)',
      async ({
        request: requestBody,
        response: expectedResponse,
        saved: expectedSaved,
      }) => {
        const { id: userId, email } = getUser();

        const response = await request(getApp().getHttpServer())
          .post('/v1/manage/exercises')
          .set('x-user-email', email)
          .send(requestBody)
          .expect(201);

        const exercise = createExerciseResponseSchema.parse(response.body);
        expect(exercise).toEqual(expectedResponse);

        const saved = await findById('exercises', exercise.id);
        expect(saved).toEqual(
          expect.objectContaining({
            ...expectedSaved,
            userId,
          }),
        );
      },
    );
  });

  describe('missing fields', () => {
    it.each([
      // Checks missing common fields
      {
        label: 'common',
        request: {
          scenario: 'Order a meal.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like tea.'],
        },
        response: {
          details: expect.objectContaining({
            format: expect.any(String),
          }),
        },
      },
      // Checks missing communication-specific fields
      {
        label: 'communication',
        request: {
          format: 'communication',
        },
        response: {
          details: expect.objectContaining({
            scenario: expect.any(String),
            prompts: expect.any(String),
            validResponses: expect.any(String),
          }),
        },
      },
      // Checks missing word-format fields
      {
        label: 'word',
        request: {
          format: 'word',
        },
        response: {
          details: expect.objectContaining({
            word: expect.any(String),
            meaning: expect.any(String),
          }),
        },
      },
      // Checks missing sentence-format fields
      {
        label: 'sentence',
        request: {
          format: 'sentence',
        },
        response: {
          details: expect.objectContaining({
            scenario: expect.any(String),
            sentence: expect.any(String),
          }),
        },
      },
      // Checks missing paragraph-format fields
      {
        label: 'paragraph',
        request: {
          format: 'paragraph',
        },
        response: {
          details: expect.objectContaining({
            scenario: expect.any(String),
            paragraph: expect.any(String),
          }),
        },
      },
    ])(
      'should reject missing $label fields (TC_API_CE_04)',
      async ({ request: requestBody, response: expectedResponse }) => {
        const response = await request(getApp().getHttpServer())
          .post('/v1/manage/exercises')
          .set('x-user-email', getUser().email)
          .send({ topics: ['Test topic'], status: 'active', ...requestBody })
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            code: 'invalid_request_body',
            message: 'Request validation failed',
            ...expectedResponse,
          }),
        );
      },
    );
  });

  describe('invalid field type', () => {
    it.each([
      // Gives common fields incorrect types
      {
        label: 'common',
        request: {
          format: 1,
          topics: 1,
          status: 1,
          references: 1,
          scenario: 'Order a meal.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like tea.'],
        },
        response: {
          details: expect.objectContaining({
            format: expect.any(String),
          }),
        },
      },
      // Gives communication-specific fields incorrect types.
      {
        label: 'communication',
        request: {
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: 1,
          prompts: 1,
          validResponses: 1,
        },
        response: {
          details: expect.objectContaining({
            scenario: expect.any(String),
            prompts: expect.any(String),
            validResponses: expect.any(String),
          }),
        },
      },
      // Gives word-format fields incorrect types.
      {
        label: 'word',
        request: {
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
          word: 1,
          meaning: 1,
          sentences: 1,
          clues: 1,
        },
        response: {
          details: expect.objectContaining({
            word: expect.any(String),
            meaning: expect.any(String),
            sentences: expect.any(String),
            clues: expect.any(String),
          }),
        },
      },
      // Gives sentence-format fields incorrect types.
      {
        label: 'sentence',
        request: {
          format: 'sentence',
          topics: ['Test topic'],
          status: 'active',
          sentence: 1,
          words: 1,
          scenario: 1,
        },
        response: {
          details: expect.objectContaining({
            sentence: expect.any(String),
            words: expect.any(String),
            scenario: expect.any(String),
          }),
        },
      },
      // Gives paragraph-format fields incorrect types.
      {
        label: 'paragraph',
        request: {
          format: 'paragraph',
          topics: ['Test topic'],
          status: 'active',
          paragraph: 1,
          words: 1,
          scenario: 1,
        },
        response: {
          details: expect.objectContaining({
            paragraph: expect.any(String),
            words: expect.any(String),
            scenario: expect.any(String),
          }),
        },
      },
    ])(
      'should reject invalid $label field types (TC_API_CE_05)',
      async ({ request: requestBody, response: expectedResponse }) => {
        const response = await request(getApp().getHttpServer())
          .post('/v1/manage/exercises')
          .set('x-user-email', getUser().email)
          .send(requestBody)
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            code: 'invalid_request_body',
            message: 'Request validation failed',
            ...expectedResponse,
          }),
        );
        expect(await findAll('exercises', { userId: getUser().id })).toHaveLength(0);
      },
    );
  });

  describe('invalid field value', () => {
    it.each([
      // Invalid common field values
      {
        label: 'common',
        request: {
          format: 'dialogue',
          topics: [' ', ''],
          status: 'draft',
          references: [' ', '\t'],
          scenario: 'Order a meal.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like tea.'],
        },
        response: {
          details: expect.objectContaining({
            format: expect.any(String),
          }),
        },
      },
      // Blank communication field values
      {
        label: 'communication',
        request: {
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: '  ',
          prompts: [' ', ''],
          validResponses: [],
          references: [],
        },
        response: {
          details: expect.objectContaining({
            scenario: expect.any(String),
            prompts: expect.any(String),
            validResponses: expect.any(String),
          }),
        },
      },
      // Blank word-format field values
      {
        label: 'word',
        request: {
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
          word: '  ',
          meaning: '  ',
        },
        response: {
          details: expect.objectContaining({
            word: expect.any(String),
            meaning: expect.any(String),
          }),
        },
      },
      // Blank sentence-format field values
      {
        label: 'sentence',
        request: {
          format: 'sentence',
          topics: ['Test topic'],
          status: 'active',
          sentence: '  ',
          scenario: '  ',
        },
        response: {
          details: expect.objectContaining({
            sentence: expect.any(String),
            scenario: expect.any(String),
          }),
        },
      },
      // Blank paragraph-format field values
      {
        label: 'paragraph',
        request: {
          format: 'paragraph',
          topics: ['Test topic'],
          status: 'active',
          paragraph: '  ',
          scenario: '  ',
        },
        response: {
          details: expect.objectContaining({
            paragraph: expect.any(String),
            scenario: expect.any(String),
          }),
        },
      },
    ])(
      'should reject invalid $label field values (TC_API_CE_06)',
      async ({ request: requestBody, response: expectedResponse }) => {
        const response = await request(getApp().getHttpServer())
          .post('/v1/manage/exercises')
          .set('x-user-email', getUser().email)
          .send(requestBody)
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            code: 'invalid_request_body',
            message: 'Request validation failed',
            ...expectedResponse,
          }),
        );
        expect(await findAll('exercises', { userId: getUser().id })).toHaveLength(0);
      },
    );
  });

  describe('unknown fields', () => {
    it('should reject inapplicable and unknown properties (TC_API_CE_07)', async () => {
      const { id: userId } = getUser();
      const name = `${userId.toHexString()} inapplicable and unknown properties`;
      const body = {
        skill: 'communication',
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: name,
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
        name: 'Client-supplied name',
        word: 'serendipity',
        unexpected: 'value',
      };

      const response = await request(getApp().getHttpServer())
        .post('/v1/manage/exercises')
        .set('x-user-email', getUser().email)
        .send(body)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          code: 'invalid_request_body',
          message: 'Request validation failed',
          details: expect.objectContaining({
            word: expect.any(String),
            name: expect.any(String),
            unexpected: expect.any(String),
            skill: expect.any(String),
          }),
        }),
      );
      expect(await findAll('exercises', { name })).toHaveLength(0);
    });
  });

  describe('optional fields', () => {
    it('should not persist omitted optional fields (TC_API_CE_08)', async () => {
      const { id: userId, email } = getUser();
      const name = `${userId.toHexString()} communication-without-references`;
      const body = {
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: name,
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
      };

      const response = await request(getApp().getHttpServer())
        .post('/v1/manage/exercises')
        .set('x-user-email', email)
        .send(body)
        .expect(201);

      const exercise = createExerciseResponseSchema.parse(response.body);
      const saved = await findById('exercises', exercise.id);
      expect(saved).toEqual(expect.objectContaining({ name, userId }));
      expect(saved).not.toHaveProperty('references');
    });

    it('should not persist empty optional fields (TC_API_CE_08)', async () => {
      const { id: userId, email } = getUser();
      const body = {
        format: 'word',
        topics: ['Test topic'],
        status: 'active',
        word: 'serendipity',
        meaning: 'Finding something valuable by chance.',
        references: [],
        sentences: [],
        clues: [],
      };

      const response = await request(getApp().getHttpServer())
        .post('/v1/manage/exercises')
        .set('x-user-email', email)
        .send(body)
        .expect(201);

      const exercise = createExerciseResponseSchema.parse(response.body);
      const saved = await findById('exercises', exercise.id);
      expect(saved).toEqual(
        expect.objectContaining({
          name: 'serendipity',
          format: 'word',
          userId,
        }),
      );

      for (const field of [
        'references',
        'sentences',
        'clues',
        'prompts',
        'validResponses',
        'words',
      ]) {
        expect(saved).not.toHaveProperty(field);
      }
    });
  });

  describe('server error', () => {
    it('should hide internal details on service failure (TC_API_CE_09)', async () => {
      const { id: userId } = getUser();
      const name = `${userId.toHexString()} persistence-failure`;
      const body = {
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: name,
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
      };
      const createSpy = vi
        .spyOn(getApp().get(ExerciseService), 'create')
        .mockRejectedValue(new Error('database connection reset'));

      try {
        const response = await request(getApp().getHttpServer())
          .post('/v1/manage/exercises')
          .set('x-user-email', getUser().email)
          .send(body)
          .expect(500);

        expect(response.body).toEqual({
          code: 'internal_error',
          message: 'An unexpected error occurred. Please try again later.',
        });
        expect(JSON.stringify(response.body)).not.toContain(
          'database connection reset',
        );
        expect(await findAll('exercises', { name })).toHaveLength(0);
      } finally {
        createSpy.mockRestore();
      }
    });
  });
});
