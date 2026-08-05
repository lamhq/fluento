import request from 'supertest';

import { findById, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('delete exercise', () => {
  const { cleanupMarker, getApp } = setUpApiTest();

  it('should remove a record from database', async () => {
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

    const deleteResponse = await request(getApp().getHttpServer())
      .delete(`/exercises/${exerciseId}`)
      .expect(200);

    expect(deleteResponse.body).toEqual(
      expect.objectContaining({
        id: exerciseId,
        topics: expect.arrayContaining(['Restaurant', cleanupMarker]),
        scenario: 'ordering food in a restaurant',
      }),
    );

    const deletedExercise = await findById('exercises', exerciseId);

    expect(deletedExercise).toBeNull();
  });
});
