import request from 'supertest';

import { findById } from '../../utils/mongodb';
import { setUpApiTest } from '../../utils/test';

describe('create exercise', () => {
  const { cleanupMarker, getApp } = setUpApiTest();

  it('should add a record in database', async () => {
    const dto = {
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
    };

    const resp = await request(getApp().getHttpServer())
      .post('/exercises')
      .send(dto)
      .expect(201);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: dto.name,
        sentences: dto.sentences,
        prompts: dto.prompts,
        topics: dto.topics,
      }),
    );

    const body: { id: string } = resp.body;
    const savedExercise = await findById('exercises', body.id);

    expect(savedExercise).not.toBeNull();
    expect(savedExercise).toEqual(
      expect.objectContaining({
        name: dto.name,
        sentences: dto.sentences,
        prompts: dto.prompts,
        topics: dto.topics,
      }),
    );
  });
});
