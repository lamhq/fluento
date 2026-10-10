import { findExercisesSchema } from './find-exercises.dto';

describe('FindExercisesDto', () => {
  it('normalizes query filters and applies pagination defaults', () => {
    const result = findExercisesSchema.parse({
      topics: 'Travel',
      skills: 'communication',
      formats: 'communication',
      status: 'active',
    });

    expect(result).toEqual({
      topics: ['Travel'],
      skills: ['communication'],
      formats: ['communication'],
      status: ['active'],
      offset: 0,
      limit: 10,
    });
  });
});
