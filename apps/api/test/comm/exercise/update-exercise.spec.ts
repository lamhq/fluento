import request from 'supertest';

import { findById, insertMany } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('update exercise', () => {
  const { cleanupMarker, getApp } = setUpApiTest();

  it('should update a record in database', async () => {
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

    const dto = {
      name: 'E2E Exercise Updated',
      topics: ['help', 'updated'],
    };
    const resp = await request(getApp().getHttpServer())
      .patch(`/exercises/${exerciseId}`)
      .send(dto)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: exerciseId,
        name: dto.name,
        topics: dto.topics,
      }),
    );

    const updatedExercise = await findById('exercises', exerciseId);

    expect(updatedExercise).not.toBeNull();
    expect(updatedExercise?._id.toString()).toBe(exerciseId);
    expect(updatedExercise).toEqual(
      expect.objectContaining({
        name: dto.name,
        topics: dto.topics,
      }),
    );
  });
});
