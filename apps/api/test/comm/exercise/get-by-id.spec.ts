import request from 'supertest';

import { insertMany } from '../../utils/mongodb';
import { deleteMarker, setupExerciseCrudTests } from './shared';

describe('Exercise CRUD (e2e) - get by id', () => {
  const getApp = setupExerciseCrudTests();

  it('get exercise', async () => {
    const [seededExerciseId] = await insertMany('exercises', [
      {
        name: `Seeded exercise ${deleteMarker}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        sentences: [
          {
            content: 'This record was inserted by the test helper.',
            style: 'neutral',
            meaning: 'Đây là bản ghi được chèn bằng helper test.',
          },
        ],
        prompts: [
          {
            content: 'Reply with a greeting.',
            style: 'neutral',
            meaning: 'Trả lời bằng một lời chào.',
          },
        ],
        topics: ['seeded', 'test'],
      },
    ]);

    const resp = await request(getApp().getHttpServer())
      .get(`/exercises/${seededExerciseId}`)
      .expect(200);

    expect(resp.body).toEqual(
      expect.objectContaining({
        id: seededExerciseId,
        name: expect.stringContaining(deleteMarker),
      }),
    );
  });
});
