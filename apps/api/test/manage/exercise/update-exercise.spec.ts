import request from 'supertest';

import { deleteMany, findById, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('update exercise', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should update a record in database', async () => {
    const { email: userEmail, id: userId } = getUser();

    const [exerciseId] = await insertMany('exercises', [
      {
        userId,
        name: 'Ordering food',
        skill: 'communication',
        format: 'communication',
        topics: ['Restaurant', cleanupMarker],
        scenario: 'ordering food in a restaurant',
        prompts: ['Say that you would like to order a meal.'],
        validResponses: ['I would like to order the grilled salmon, please.'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const dto = {
      status: 'active',
      name: 'Introducing yourself',
      skill: 'communication',
      format: 'communication',
      topics: ['Job Interview', cleanupMarker],
      scenario: 'introducing yourself',
      prompts: ['Introduce yourself briefly and explain your experience.'],
      validResponses: [
        'Hi, I am a software engineer with five years of experience.',
      ],
    };
    const resp = await request(getApp().getHttpServer())
      .patch(`/v1/manage/exercises/${exerciseId}`)
      .set('x-user-email', userEmail)
      .send(dto)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: exerciseId,
        status: dto.status,
        name: dto.name,
        skill: dto.skill,
        format: dto.format,
        topics: dto.topics,
        scenario: dto.scenario,
        prompts: dto.prompts,
        validResponses: dto.validResponses,
      }),
    );

    const updatedExercise = await findById('exercises', exerciseId);

    expect(updatedExercise).not.toBeNull();
    expect(updatedExercise?._id.toString()).toBe(exerciseId);
    expect(updatedExercise).toEqual(
      expect.objectContaining({
        status: dto.status,
        name: dto.name,
        skill: dto.skill,
        format: dto.format,
        topics: dto.topics,
        scenario: dto.scenario,
        prompts: dto.prompts,
        validResponses: dto.validResponses,
      }),
    );
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
