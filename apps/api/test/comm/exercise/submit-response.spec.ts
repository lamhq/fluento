import request from 'supertest';

import { RESPONSE_EVALUATION_SERVICE } from '../../../src/comm/core/response-evaluation-service.port';
import { deleteMany, findOne, insert } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('submit response', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should validate and evaluate a learner response', async () => {
    const { email, id: userId } = getUser();
    const responseText =
      'I was hoping you could give me a lift to the airport.';

    // mock the evaluation service to return a fake evaluation result
    jest
      .spyOn(getApp().get(RESPONSE_EVALUATION_SERVICE), 'evaluate')
      .mockResolvedValue(fakeEvaluation);

    const exercise = await insert('exercises', {
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
    });

    const resp = await request(getApp().getHttpServer())
      .post(`/comm/exercises/${exercise._id.toString()}/responses`)
      .set('x-user-email', email)
      .send({
        response: responseText,
      })
      .expect(201);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        exerciseId: exercise._id.toString(),
        response: responseText,
        feedback: expect.any(String),
        score: expect.any(Number),
        correctness: expect.objectContaining({
          score: expect.any(Number),
          feedback: expect.any(String),
          fixes: expect.any(Array),
          correctedSentence: expect.any(String),
        }),
        appropriateness: expect.objectContaining({
          score: expect.any(Number),
          feedback: expect.any(String),
          clarity: expect.objectContaining({
            score: expect.any(Number),
            feedback: expect.any(String),
          }),
          politeness: expect.objectContaining({
            score: expect.any(Number),
            feedback: expect.any(String),
          }),
          tone: expect.objectContaining({
            score: expect.any(Number),
            feedback: expect.any(String),
          }),
        }),
      }),
    );

    const storedSubmission = await findOne('response_submissions', {
      learnerId: userId,
      exerciseId: exercise._id.toString(),
    });

    expect(storedSubmission).toEqual(
      expect.objectContaining({
        learnerId: userId,
        exerciseId: exercise._id.toString(),
        response: responseText,
      }),
    );
  });

  afterEach(async () => {
    await deleteMany('response_submissions', {
      exerciseId: { $regex: cleanupMarker },
    });
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});

// Fake evaluation returned by evaluation service in tests.
const fakeEvaluation = {
  prompt: 'Politely ask your friend to take you to the airport.',
  response: 'I was hoping you could give me a lift to the airport.',
  feedback: 'Good response. It sounds polite and relevant.',
  correctness: {
    score: 95,
    feedback: 'Correct and natural.',
    fixes: [],
    correctedSentence: 'I was hoping you could give me a lift to the airport.',
  },
  appropriateness: {
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
};
