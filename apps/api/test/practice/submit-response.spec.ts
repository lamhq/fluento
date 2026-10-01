import { ObjectId } from 'mongodb';
import request from 'supertest';
import { z } from 'zod';

import type { EvaluationResult } from '../../src/practice/core/evaluation.service';
import { EvaluationChain } from '../../src/practice/core/evaluation-chain';
import { PracticeType } from '../../src/practice/core/practice-attempt.entity';
import { deleteMany, findOne, insertMany } from '../utils/mongodb';
import { setUpApiTest } from '../utils/test';

const responseBaseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  practiceType: z.enum([
    'communication',
    'usingWord',
    'justOneWord',
    'wordGuessing',
    'sentenceConstruction',
    'sentenceVariation',
    'paragraphVariation',
  ]),
  response: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

const correctnessSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  fixes: z.array(z.string()).optional(),
  correctedSentence: z.string().optional(),
});

const appropriatenessSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

const submitResponseSchema = z.discriminatedUnion('practiceType', [
  responseBaseSchema.extend({
    practiceType: z.literal('communication'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema.extend({
      clarity: z.object({
        score: z.number().min(0).max(100),
        feedback: z.string(),
      }),
      politeness: z.object({
        score: z.number().min(0).max(100),
        feedback: z.string(),
      }),
      tone: z.object({
        score: z.number().min(0).max(100),
        feedback: z.string(),
      }),
    }),
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('usingWord'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('sentenceConstruction'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('sentenceVariation'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('paragraphVariation'),
    correctness: correctnessSchema.extend({
      sentences: z.array(
        z.object({
          sentence: z.string(),
          score: z.number().min(0).max(100),
          feedback: z.string(),
          fixes: z.array(z.string()).optional(),
          correctedSentence: z.string().optional(),
        }),
      ),
    }),
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('justOneWord'),
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('wordGuessing'),
  }),
]);

const submissionCases = [
  {
    practiceType: 'communication' as const,
    response: 'My parents are coming to visit. What about you?',
    format: 'communication',
    skill: 'communication',
    name: 'Small talk',
    scenario: 'Answer small talk questions',
    prompts: ['What are you up to this weekend?'],
  },
  {
    practiceType: 'usingWord' as const,
    response: "At customs, they'll check my passport.",
    format: 'word',
    skill: 'vocabulary',
    name: 'customs',
    word: 'customs',
    meaning: 'The official procedures required when entering a country.',
    sentences: ["At customs, they're going to ask for your passport."],
    clues: ['passport', 'inspection', 'border'],
  },
  {
    practiceType: 'justOneWord' as const,
    response: 'customs',
    format: 'word',
    skill: 'vocabulary',
    name: 'customs clues',
    word: 'customs',
    meaning: 'The official procedures required when entering a country.',
    sentences: [],
    clues: ['passport', 'inspection', 'border'],
  },
  {
    practiceType: 'wordGuessing' as const,
    response: 'customs',
    format: 'word',
    skill: 'vocabulary',
    name: 'customs meaning',
    word: 'customs',
    meaning: 'The official procedures required when entering a country.',
    sentences: [],
    clues: [],
  },
  {
    practiceType: 'sentenceConstruction' as const,
    response:
      "I studied computer science at university and earned a bachelor's degree.",
    format: 'sentence',
    skill: 'articulation',
    name: 'Describe your background',
    scenario: 'Describe your background',
    words: ['study', 'computer science', 'university', "bachelor's degree"],
    sentence:
      "I studied computer science at university and had a bachelor's degree.",
  },
  {
    practiceType: 'sentenceVariation' as const,
    response:
      "I earned a bachelor's degree in computer science from university.",
    format: 'sentence',
    skill: 'articulation',
    name: 'Rewrite your background',
    scenario: 'Describe your background',
    words: [],
    sentence:
      "I studied computer science at university and had a bachelor's degree.",
  },
  {
    practiceType: 'paragraphVariation' as const,
    response:
      'The festival is an important Vietnamese tradition. Families gather to enjoy food, lanterns, and the full moon.',
    format: 'paragraph',
    skill: 'articulation',
    name: 'Festival introduction',
    scenario: 'Mid-Autumn Festival Introduction',
    prompts: ['Rewrite the paragraph with the same meaning.'],
    words: ['festival', 'lanterns', 'family reunion'],
    paragraph:
      'The Mid-Autumn Festival is an important traditional celebration in Vietnam. Families gather to enjoy mooncakes and tea while admiring the full moon.',
  },
];

const evaluationResponses: Record<PracticeType, EvaluationResult> = {
  [PracticeType.Communication]: {
    score: 94,
    feedback: 'Good response. It sounds polite and relevant.',
    correctness: {
      score: 95,
      feedback: 'Correct and natural.',
      fixes: [],
      correctedSentence: 'My parents are coming to visit. What about you?',
    },
    appropriateness: {
      score: 93,
      feedback: 'Well suited to the situation.',
      clarity: {
        score: 90,
        feedback: 'Clear and easy to understand.',
      },
      politeness: {
        score: 95,
        feedback: 'Very polite.',
      },
      tone: {
        score: 90,
        feedback: 'Friendly and appropriate.',
      },
    },
  },
  [PracticeType.UsingWord]: {
    score: 92,
    feedback: 'The target word is used naturally and correctly.',
    correctness: {
      score: 94,
      feedback: 'The sentence is grammatically correct.',
      fixes: [],
      correctedSentence: "At customs, they'll check my passport.",
    },
    appropriateness: {
      score: 90,
      feedback: 'The target word fits the context accurately.',
    },
  },
  [PracticeType.JustOneWord]: {
    score: 100,
    feedback: 'The response matches the target word.',
  },
  [PracticeType.WordGuessing]: {
    score: 100,
    feedback: 'The response matches the target word.',
  },
  [PracticeType.SentenceConstruction]: {
    score: 92,
    feedback: 'The sentence uses all required words clearly.',
    correctness: {
      score: 88,
      feedback: 'The sentence is understandable and grammatically sound.',
      fixes: [],
      correctedSentence:
        "I studied computer science at university and earned a bachelor's degree.",
    },
    appropriateness: {
      score: 96,
      feedback: 'All required words are used appropriately.',
    },
  },
  [PracticeType.SentenceVariation]: {
    score: 93,
    feedback: 'The sentence preserves the original meaning naturally.',
    correctness: {
      score: 95,
      feedback: 'The sentence is grammatically correct.',
      fixes: [],
      correctedSentence:
        "I earned a bachelor's degree in computer science from university.",
    },
    appropriateness: {
      score: 91,
      feedback: 'The original meaning is preserved accurately.',
    },
  },
  [PracticeType.ParagraphVariation]: {
    score: 91,
    feedback: 'The paragraph preserves the original meaning clearly.',
    correctness: {
      score: 90,
      feedback: 'The rewritten paragraph is grammatically correct.',
      fixes: [],
      correctedSentence:
        'The festival is an important Vietnamese tradition. Families gather to enjoy food, lanterns, and the full moon.',
      sentences: [
        {
          sentence: 'The festival is an important Vietnamese tradition.',
          score: 90,
          feedback: 'The sentence is clear and correct.',
          fixes: [],
          correctedSentence:
            'The festival is an important Vietnamese tradition.',
        },
        {
          sentence:
            'Families gather to enjoy food, lanterns, and the full moon.',
          score: 90,
          feedback: 'The sentence is clear and correct.',
          fixes: [],
          correctedSentence:
            'Families gather to enjoy food, lanterns, and the full moon.',
        },
      ],
    },
    appropriateness: {
      score: 92,
      feedback: 'The paragraph keeps the original meaning.',
    },
  },
};

describe('submit response', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it.each(submissionCases)(
    'should submit and validate a $practiceType response',
    async (submissionCase) => {
      const { email, id: userId } = getUser();

      const evaluationResponse =
        evaluationResponses[submissionCase.practiceType];

      // Mock the evaluation chain to avoid calling the AI provider.
      jest
        .spyOn(getApp().get(EvaluationChain), 'evaluate')
        .mockResolvedValue(evaluationResponse);

      const exerciseIds = await insertMany('exercises', [
        {
          status: 'active',
          references: [],
          ...submissionCase,
          topics: ['Practice', cleanupMarker],
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      const exerciseId = exerciseIds[0];

      const resp = await request(getApp().getHttpServer())
        .post(`/v1/practice/exercises/${exerciseId}/responses`)
        .set('x-user-email', email)
        .set('Accept', 'application/json')
        .send({
          practiceType: submissionCase.practiceType,
          response: submissionCase.response,
        })
        .expect(201);

      const response = submitResponseSchema.parse(resp.body);

      expect(response).toEqual(
        expect.objectContaining({
          exerciseId,
          practiceType: submissionCase.practiceType,
          response: submissionCase.response,
        }),
      );

      const storedSubmission = await findOne('practice_attempts', {
        userId,
        exerciseId: new ObjectId(exerciseId),
      });

      expect(storedSubmission).toEqual(
        expect.objectContaining({
          userId,
          exerciseId: new ObjectId(exerciseId),
          response: submissionCase.response,
        }),
      );
    },
  );

  afterEach(async () => {
    const { id: userId } = getUser();
    await deleteMany('practice_attempts', {
      userId: userId,
    });
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
