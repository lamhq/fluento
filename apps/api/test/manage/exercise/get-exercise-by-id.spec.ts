import request from 'supertest';

import { deleteMany, insertMany } from '../../utils/mongodb.js';
import { setUpApiTest } from '../../utils/test.js';

describe('get exercise by id', () => {
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

    expect(resp.body).toEqual({
      id: seededExerciseId,
      name: 'Asking for an explanation',
      skill: 'communication',
      format: 'communication',
      topics: expect.arrayContaining(['School', cleanupMarker]),
      createdAt: expect.any(String),
      status: 'active',
    });
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
