import request from 'supertest';

import { ExerciseService } from '../../../src/content/core/exercise.service.js';
import {
  deleteMany,
  findById,
  insertMany,
  MongoDocument,
} from '../../utils/mongodb.js';
import { setUpApiTest } from '../../utils/test.js';
import { createExerciseResponseSchema } from './create-exercise.schema.js';

describe('update exercise', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();
  let exerciseId: string;
  let originalExercise: MongoDocument;

  beforeEach(async () => {
    // Clean up any existing exercises before each test
    await deleteMany('exercises', {});
    const { id: userId } = getUser();

    // Insert a new exercise for testing
    [exerciseId] = await insertMany('exercises', [
      {
        userId,
        name: `${cleanupMarker} original exercise`,
        skill: 'communication',
        format: 'communication',
        topics: ['Test topic', cleanupMarker],
        status: 'archived',
        scenario: 'Order a meal at a restaurant.',
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
        updatedAt: new Date('2020-01-01T00:00:00.000Z'),
      },
    ]);
    const exercise = await findById('exercises', exerciseId);
    if (!exercise) throw new Error('Failed to insert exercise');
    originalExercise = exercise;
  });

  async function expectExerciseUnchanged() {
    expect(await findById('exercises', exerciseId)).toEqual(originalExercise);
  }

  describe('happy cases', () => {
    it.each([
      {
        skill: 'communication',
        format: 'communication',
        name: 'Communication exercise',
        topics: ['Test topic', cleanupMarker],
        status: 'active',
        scenario: 'Order a meal at a restaurant.',
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
      },
      {
        skill: 'vocabulary',
        format: 'word',
        name: 'Vocabulary exercise',
        topics: ['Test topic', cleanupMarker],
        status: 'archived',
        word: 'serendipity',
        meaning: 'Finding something valuable by chance.',
        sentences: ['We met by serendipity.'],
        clues: ['An unexpected fortunate discovery.'],
      },
      {
        skill: 'articulation',
        format: 'sentence',
        name: 'Articulation sentence exercise',
        topics: ['Test topic', cleanupMarker],
        status: 'active',
        scenario: 'Practice saying the sentence clearly.',
        sentence: 'The quick brown fox jumps over the lazy dog.',
        words: ['quick', 'lazy'],
      },
      {
        skill: 'articulation',
        format: 'paragraph',
        name: 'Articulation paragraph exercise',
        topics: ['Test topic', cleanupMarker],
        status: 'active',
        scenario: 'Practice reading the paragraph aloud.',
        paragraph: 'A short paragraph for articulation practice.',
        words: ['articulation', 'practice'],
      },
    ])(
      'should update exercise with $format format (TC_API_UE_01)',
      async (requestData) => {
        const { id: userId, email } = getUser();
        const body = {
          ...requestData,
          name: `${cleanupMarker} ${requestData.format}`,
        };

        const response = await request(getApp().getHttpServer())
          .put(`/v1/manage/exercises/${exerciseId}`)
          .set('x-user-email', email)
          .send(body)
          .expect(200);

        const exercise = createExerciseResponseSchema.parse(response.body);
        expect(exercise).toEqual({
          id: exerciseId,
          name: body.name,
          skill: requestData.skill,
          format: requestData.format,
          topics: requestData.topics,
          createdAt: expect.any(String),
          status: requestData.status,
        });

        const saved = await findById('exercises', exercise.id);
        expect(saved).toEqual(
          expect.objectContaining({
            ...requestData,
            name: body.name,
            userId,
          }),
        );
        expect(saved?.updatedAt).not.toEqual(originalExercise.updatedAt);
        expect(saved?.createdAt).toEqual(originalExercise.createdAt);
      },
    );
  });

  describe('unauthenticated', () => {
    it('should reject unauthenticated requests (TC_API_UE_02)', async () => {
      await request(getApp().getHttpServer())
        .put(`/v1/manage/exercises/${exerciseId}`)
        .send({
          name: `${cleanupMarker} unauthenticated`,
          skill: 'communication',
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: 'Order a meal at a restaurant.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like the grilled salmon, please.'],
        })
        .expect(401);

      await expectExerciseUnchanged();
    });
  });

  describe('normalize field values', () => {
    it('should trim and remove blank items (TC_API_UE_03)', async () => {
      const name = `${cleanupMarker} normalized`;
      const body = {
        name: `  ${name}  `,
        skill: 'communication',
        format: 'communication',
        topics: ['  Cafe  ', ' ', 'Restaurant  '],
        status: 'active',
        scenario: '  Practice ordering.  ',
        prompts: ['  Ask to order.  ', ' ', ''],
        validResponses: ['  I would like tea.  '],
        references: ['  https://example.test/source  ', ' '],
      };

      const response = await request(getApp().getHttpServer())
        .put(`/v1/manage/exercises/${exerciseId}`)
        .set('x-user-email', getUser().email)
        .send(body)
        .expect(200);

      const exercise = createExerciseResponseSchema.parse(response.body);
      expect(exercise).toEqual(
        expect.objectContaining({
          name,
          topics: ['Cafe', 'Restaurant'],
        }),
      );
      const saved = await findById('exercises', exercise.id);
      expect(saved).toEqual(
        expect.objectContaining({
          name,
          scenario: 'Practice ordering.',
          prompts: ['Ask to order.'],
          validResponses: ['I would like tea.'],
          topics: ['Cafe', 'Restaurant'],
          references: ['https://example.test/source'],
        }),
      );
    });
  });

  describe('missing fields', () => {
    it.each([
      {
        label: 'common',
        body: {},
        missingFields: ['name', 'skill', 'format', 'topics', 'status'],
      },
      {
        label: 'communication',
        body: {
          name: 'Communication exercise',
          skill: 'communication',
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
        },
        missingFields: ['scenario', 'prompts', 'validResponses'],
      },
      {
        label: 'word',
        body: {
          name: 'Vocabulary exercise',
          skill: 'vocabulary',
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
        },
        missingFields: ['word', 'meaning', 'sentences', 'clues'],
      },
      {
        label: 'sentence',
        body: {
          name: 'Articulation sentence exercise',
          skill: 'articulation',
          format: 'sentence',
          topics: ['Test topic'],
          status: 'active',
        },
        missingFields: ['scenario', 'sentence', 'words'],
      },
      {
        label: 'paragraph',
        body: {
          name: 'Articulation paragraph exercise',
          skill: 'articulation',
          format: 'paragraph',
          topics: ['Test topic'],
          status: 'active',
        },
        missingFields: ['scenario', 'paragraph', 'words'],
      },
    ])(
      'should reject missing $label fields (TC_API_UE_04)',
      async ({ body, missingFields }) => {
        const response = await request(getApp().getHttpServer())
          .put(`/v1/manage/exercises/${exerciseId}`)
          .set('x-user-email', getUser().email)
          .send(body)
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            code: 'invalid_request_body',
            message: 'Request validation failed',
            details: expect.objectContaining(
              Object.fromEntries(
                missingFields.map((field) => [field, expect.any(String)]),
              ),
            ),
          }),
        );
        await expectExerciseUnchanged();
      },
    );
  });

  describe('invalid field type', () => {
    it.each([
      {
        label: 'common',
        body: {
          name: 1,
          skill: 1,
          format: 1,
          topics: 1,
          status: 1,
          references: 1,
        },
        invalidFields: ['name', 'skill', 'format', 'topics', 'status', 'references'],
      },
      {
        label: 'communication',
        body: {
          name: 'Communication exercise',
          skill: 'communication',
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: 1,
          prompts: 1,
          validResponses: 1,
        },
        invalidFields: ['scenario', 'prompts', 'validResponses'],
      },
      {
        label: 'word',
        body: {
          name: 'Vocabulary exercise',
          skill: 'vocabulary',
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
          word: 1,
          meaning: 1,
          sentences: 1,
          clues: 1,
        },
        invalidFields: ['word', 'meaning', 'sentences', 'clues'],
      },
      {
        label: 'sentence',
        body: {
          name: 'Articulation sentence exercise',
          skill: 'articulation',
          format: 'sentence',
          topics: ['Test topic'],
          status: 'active',
          sentence: 1,
          words: 1,
          scenario: 1,
        },
        invalidFields: ['sentence', 'words', 'scenario'],
      },
      {
        label: 'paragraph',
        body: {
          name: 'Articulation paragraph exercise',
          skill: 'articulation',
          format: 'paragraph',
          topics: ['Test topic'],
          status: 'active',
          paragraph: 1,
          words: 1,
          scenario: 1,
        },
        invalidFields: ['paragraph', 'words', 'scenario'],
      },
    ])(
      'should reject invalid $label field types (TC_API_UE_05)',
      async ({ body, invalidFields }) => {
        const response = await request(getApp().getHttpServer())
          .put(`/v1/manage/exercises/${exerciseId}`)
          .set('x-user-email', getUser().email)
          .send(body)
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            code: 'invalid_request_body',
            message: 'Request validation failed',
            details: expect.objectContaining(
              Object.fromEntries(
                invalidFields.map((field) => [field, expect.any(String)]),
              ),
            ),
          }),
        );
        await expectExerciseUnchanged();
      },
    );
  });

  describe('invalid field value', () => {
    it.each([
      {
        label: 'common',
        body: {
          name: '  ',
          skill: 'grammar',
          format: 'dialogue',
          topics: [' ', ''],
          status: 'draft',
        },
        invalidFields: ['name', 'skill', 'format', 'topics', 'status'],
      },
      {
        label: 'communication',
        body: {
          name: 'Communication exercise',
          skill: 'communication',
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: '  ',
          prompts: [' ', ''],
          validResponses: [],
        },
        invalidFields: ['scenario', 'prompts', 'validResponses'],
      },
      {
        label: 'word',
        body: {
          name: 'Vocabulary exercise',
          skill: 'vocabulary',
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
          word: '  ',
          meaning: '  ',
          sentences: ['  '],
          clues: [],
        },
        invalidFields: ['word', 'meaning', 'sentences', 'clues'],
      },
      {
        label: 'sentence',
        body: {
          name: 'Articulation sentence exercise',
          skill: 'articulation',
          format: 'sentence',
          topics: ['Test topic'],
          status: 'active',
          sentence: '  ',
          words: [''],
          scenario: '  ',
        },
        invalidFields: ['sentence', 'words', 'scenario'],
      },
      {
        label: 'paragraph',
        body: {
          name: 'Articulation paragraph exercise',
          skill: 'articulation',
          format: 'paragraph',
          topics: ['Test topic'],
          status: 'active',
          paragraph: '  ',
          words: [''],
          scenario: '  ',
        },
        invalidFields: ['paragraph', 'words', 'scenario'],
      },
      {
        label: 'format-skill',
        body: {
          name: 'Vocabulary exercise',
          skill: 'communication',
          format: 'word',
          topics: ['Test topic'],
          status: 'active',
          word: 'serendipity',
          meaning: 'Finding something valuable by chance.',
          sentences: ['We met by serendipity.'],
          clues: ['An unexpected fortunate discovery.'],
        },
        invalidFields: ['format'],
      },
      {
        label: 'empty-references',
        body: {
          name: 'Communication exercise',
          skill: 'communication',
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: 'Order a meal at a restaurant.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like the grilled salmon, please.'],
          references: [],
        },
        invalidFields: ['references'],
      },
      {
        label: 'blank-references',
        body: {
          name: 'Communication exercise',
          skill: 'communication',
          format: 'communication',
          topics: ['Test topic'],
          status: 'active',
          scenario: 'Order a meal at a restaurant.',
          prompts: ['Ask to order a meal.'],
          validResponses: ['I would like the grilled salmon, please.'],
          references: [' ', '\t'],
        },
        invalidFields: ['references'],
      },
    ])(
      'should reject invalid $label field values (TC_API_UE_06)',
      async ({ body, invalidFields }) => {
        const response = await request(getApp().getHttpServer())
          .put(`/v1/manage/exercises/${exerciseId}`)
          .set('x-user-email', getUser().email)
          .send(body)
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            code: 'invalid_request_body',
            message: 'Request validation failed',
            details: expect.objectContaining(
              Object.fromEntries(
                invalidFields.map((field) => [field, expect.any(String)]),
              ),
            ),
          }),
        );
        await expectExerciseUnchanged();
      },
    );
  });

  describe('unknown fields', () => {
    it('should reject inapplicable and unknown properties (TC_API_UE_07)', async () => {
      const body = {
        name: `${cleanupMarker} inapplicable and unknown properties`,
        skill: 'communication',
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: 'Order a meal at a restaurant.',
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
        word: 'serendipity',
        unexpected: 'value',
      };

      const response = await request(getApp().getHttpServer())
        .put(`/v1/manage/exercises/${exerciseId}`)
        .set('x-user-email', getUser().email)
        .send(body)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          code: 'invalid_request_body',
          message: 'Request validation failed',
          details: expect.objectContaining({
            word: expect.any(String),
            unexpected: expect.any(String),
          }),
        }),
      );
      await expectExerciseUnchanged();
    });
  });

  describe('optional fields', () => {
    it('should not persist omitted optional references (TC_API_UE_08)', async () => {
      const { email } = getUser();
      const name = `${cleanupMarker} communication-without-references`;
      const body = {
        name,
        skill: 'communication',
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: 'Order a meal at a restaurant.',
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
      };

      const response = await request(getApp().getHttpServer())
        .put(`/v1/manage/exercises/${exerciseId}`)
        .set('x-user-email', email)
        .send(body)
        .expect(200);

      const exercise = createExerciseResponseSchema.parse(response.body);
      const saved = await findById('exercises', exercise.id);
      expect(saved).toEqual(expect.objectContaining({ name }));
      expect(saved).not.toHaveProperty('references');
    });
  });

  describe('server error', () => {
    it('should hide internal details on service failure (TC_API_UE_09)', async () => {
      const body = {
        name: `${cleanupMarker} persistence-failure`,
        skill: 'communication',
        format: 'communication',
        topics: ['Test topic'],
        status: 'active',
        scenario: 'Order a meal at a restaurant.',
        prompts: ['Ask to order a meal.'],
        validResponses: ['I would like the grilled salmon, please.'],
      };
      const updateSpy = vi
        .spyOn(getApp().get(ExerciseService), 'update')
        .mockRejectedValue(new Error('database connection secret'));

      try {
        const response = await request(getApp().getHttpServer())
          .put(`/v1/manage/exercises/${exerciseId}`)
          .set('x-user-email', getUser().email)
          .send(body)
          .expect(500);

        expect(response.body).toEqual({
          code: 'internal_error',
          message: 'An unexpected error occurred. Please try again later.',
        });
        expect(JSON.stringify(response.body)).not.toContain(
          'database connection secret',
        );
        await expectExerciseUnchanged();
      } finally {
        updateSpy.mockRestore();
      }
    });
  });
});
