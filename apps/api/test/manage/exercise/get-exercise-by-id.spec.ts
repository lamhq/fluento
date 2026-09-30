import request from 'supertest';

import { deleteMany, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('get exercise', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should return a record from database', async () => {
    const { email: userEmail, id: userId } = getUser();

    const [seededExerciseId] = await insertMany('exercises', [
      {
        userId,
        name: 'Asking for an explanation',
        skill: 'communication',
        format: 'communication',
        topics: ['School', cleanupMarker],
        scenario: 'asking for explanation',
        prompts: ['Ask the teacher guidance for solving a math problem.'],
        validResponses: [
          "Could you please help me with this math problem? I'm having trouble understanding it.",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get(`/v1/manage/exercises/${seededExerciseId}`)
      .set('x-user-email', userEmail)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: seededExerciseId,
        topics: expect.arrayContaining(['School', cleanupMarker]),
        scenario: 'asking for explanation',
        name: 'Asking for an explanation',
        skill: 'communication',
        format: 'communication',
        prompts: ['Ask the teacher guidance for solving a math problem.'],
        validResponses: [
          "Could you please help me with this math problem? I'm having trouble understanding it.",
        ],
      }),
    );
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
