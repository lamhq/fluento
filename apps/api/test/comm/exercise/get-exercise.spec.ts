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
        topics: ['School', cleanupMarker],
        scenario: 'asking for explanation',
        learnerRole: 'student',
        counterpartRole: 'teacher',
        prompts: ['Ask the teacher guidance for solving a math problem.'],
        expectedResponses: [
          {
            content:
              "Could you please help me with this math problem? I'm having trouble understanding it.",
            style: ['polite', 'respectful'],
          },
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
        learnerRole: 'student',
        counterpartRole: 'teacher',
      }),
    );
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
