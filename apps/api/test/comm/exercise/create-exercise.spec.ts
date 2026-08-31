import request from 'supertest';

import { deleteMany, findById } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('create exercise', () => {
  const { cleanupMarker, getApp, getUser } = setUpApiTest();

  it('should add a record in database', async () => {
    const { email: userEmail, id: userId } = getUser();
    const dto = {
      status: 'active',
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
        {
          content: 'Could I have the chicken curry with rice?',
          style: ['polite', 'clear'],
        },
      ],
    };

    const resp = await request(getApp().getHttpServer())
      .post('/manage/exercises')
      .set('x-user-email', userEmail)
      .send(dto)
      .expect(201);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: dto.status,
        topics: dto.topics,
        scenario: dto.scenario,
        learnerRole: dto.learnerRole,
        counterpartRole: dto.counterpartRole,
        prompts: dto.prompts,
        expectedResponses: dto.expectedResponses,
      }),
    );

    const body: { id: string } = resp.body;
    const savedExercise = await findById('exercises', body.id);

    expect(savedExercise).not.toBeNull();
    expect(savedExercise).toEqual(
      expect.objectContaining({
        userId: userId,
        status: dto.status,
        topics: dto.topics,
        scenario: dto.scenario,
        learnerRole: dto.learnerRole,
        counterpartRole: dto.counterpartRole,
        prompts: dto.prompts,
        expectedResponses: dto.expectedResponses,
      }),
    );
  });

  it('should accept archived status and reject invalid values', async () => {
    const archivedDto = {
      status: 'archived',
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
    };

    const { email: userEmail } = getUser();

    const resp = await request(getApp().getHttpServer())
      .post('/manage/exercises')
      .set('x-user-email', userEmail)
      .send(archivedDto)
      .expect(201);

    expect(resp.body).toEqual(
      expect.objectContaining({
        status: 'archived',
      }),
    );

    await request(getApp().getHttpServer())
      .post('/manage/exercises')
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
