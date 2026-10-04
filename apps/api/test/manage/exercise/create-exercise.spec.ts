import request from 'supertest';

import { deleteMany, findById } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('create exercise', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should add a record in database', async () => {
    const { email: userEmail, id: userId } = getUser();
    const dto = {
      status: 'active',
      name: 'Ordering food',
      skill: 'communication',
      format: 'communication',
      topics: ['Restaurant', cleanupMarker],
      scenario: 'ordering food in a restaurant',
      prompts: ['Say that you would like to order a meal.'],
      validResponses: [
        'I would like to order the grilled salmon, please.',
        'Could I have the chicken curry with rice?',
      ],
    };

    const resp = await request(getApp().getHttpServer())
      .post('/v1/manage/exercises')
      .set('x-user-email', userEmail)
      .send(dto)
      .expect(201);

    expect(resp.body).toEqual({
      id: expect.any(String),
      name: dto.name,
      skill: dto.skill,
      format: dto.format,
      topics: dto.topics,
      createdAt: expect.any(String),
      status: dto.status,
    });

    const body: { id: string } = resp.body;
    const savedExercise = await findById('exercises', body.id);

    expect(savedExercise).not.toBeNull();
    expect(savedExercise).toEqual(
      expect.objectContaining({
        userId,
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

  it('should accept archived status and reject invalid values', async () => {
    const archivedDto = {
      status: 'archived',
      name: 'Ordering food',
      skill: 'communication',
      format: 'communication',
      topics: ['Restaurant', cleanupMarker],
      scenario: 'ordering food in a restaurant',
      prompts: ['Say that you would like to order a meal.'],
      validResponses: ['I would like to order the grilled salmon, please.'],
    };

    const { email: userEmail } = getUser();

    const resp = await request(getApp().getHttpServer())
      .post('/v1/manage/exercises')
      .set('x-user-email', userEmail)
      .send(archivedDto)
      .expect(201);

    expect(resp.body).toEqual(
      expect.objectContaining({
        status: 'archived',
      }),
    );

    await request(getApp().getHttpServer())
      .post('/v1/manage/exercises')
      .set('x-user-email', getUser().email)
      .send({
        ...archivedDto,
        status: 'draft',
      })
      .expect(400);
  });

  afterEach(async () => {
    await deleteMany('exercises', {
      topics: { $elemMatch: { $regex: cleanupMarker } },
    });
  });
});
