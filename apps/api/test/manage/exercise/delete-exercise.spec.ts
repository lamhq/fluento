import request from 'supertest';

import { findById, insertMany } from '../../utils/mongodb.js';
import { setUpApiTest } from '../../utils/test.js';

describe('delete exercise', () => {
  const { getApp, getUser } = setUpApiTest();

  it('should remove a record from database', async () => {
    const { email: userEmail, id: userId } = getUser();
    const [exerciseId] = await insertMany('exercises', [
      {
        userId,
        topics: ['Restaurant', userId.toHexString()],
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

    await request(getApp().getHttpServer())
      .delete(`/v1/manage/exercises/${exerciseId}`)
      .set('x-user-email', userEmail)
      .expect(204);
    const deletedExercise = await findById('exercises', exerciseId);

    expect(deletedExercise).toBeNull();
  });
});
