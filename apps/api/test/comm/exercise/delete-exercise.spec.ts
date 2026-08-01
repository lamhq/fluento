import request from 'supertest';

import { findById, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('delete exercise', () => {
  const { cleanupMarker, getApp } = setUpApiTest();

  it('should remove a record from database', async () => {
    const [exerciseId] = await insertMany('exercises', [
      {
        name: `E2E Exercise ${cleanupMarker}`,
        sentences: [
          {
            content: 'Can you help me with this?',
            style: 'friendly',
            meaning: 'Bạn có thể giúp tôi với việc này không?',
          },
        ],
        prompts: [
          {
            content: 'Ask for help politely.',
            style: 'neutral',
            meaning: 'Yêu cầu giúp đỡ một cách lịch sự.',
          },
        ],
        topics: ['help', 'polite'],
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
        name: expect.stringContaining(cleanupMarker),
      }),
    );

    const deletedExercise = await findById('exercises', exerciseId);

    expect(deletedExercise).toBeNull();
  });
});
