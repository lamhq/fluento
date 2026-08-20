import request from 'supertest';

import { deleteMany, findById, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('update exercise', () => {
  const { cleanupMarker, getApp } = setUpApiTest();

  it('should update a record in database', async () => {
    const [exerciseId] = await insertMany('exercises', [
      {
        topics: ['Restaurant', cleanupMarker],
        scenario: 'ordering food in a restaurant',
        learnerRole: 'customer',
        counterpartRole: 'waiter',
        prompts: ['Say that you would like to order a meal.'],
        expectedResponses: [
          {
            content: 'I would like to order the grilled salmon, please.',
            style: ['polite', 'simple'],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const dto = {
      topics: ['Job Interview', cleanupMarker],
      scenario: 'introducing yourself',
      learnerRole: 'interviewee',
      counterpartRole: 'interviewer',
    };
    const resp = await request(getApp().getHttpServer())
      .patch(`/exercises/${exerciseId}`)
      .send(dto)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: exerciseId,
        topics: dto.topics,
        scenario: dto.scenario,
        learnerRole: dto.learnerRole,
        counterpartRole: dto.counterpartRole,
      }),
    );

    const updatedExercise = await findById('exercises', exerciseId);

    expect(updatedExercise).not.toBeNull();
    expect(updatedExercise?._id.toString()).toBe(exerciseId);
    expect(updatedExercise).toEqual(
      expect.objectContaining({
        topics: dto.topics,
        scenario: dto.scenario,
        learnerRole: dto.learnerRole,
        counterpartRole: dto.counterpartRole,
      }),
    );
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
