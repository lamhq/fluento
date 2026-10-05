import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { FindExercisesDto } from './find-exercises.dto';

describe('FindExercisesDto', () => {
  it('normalizes single array-filter query values', () => {
    const dto = plainToInstance(FindExercisesDto, {
      topics: 'Travel',
      skills: 'communication',
      formats: 'communication',
      status: 'active',
    });

    expect(dto).toEqual(
      expect.objectContaining({
        topics: ['Travel'],
        skills: ['communication'],
        formats: ['communication'],
        status: ['active'],
      }),
    );
    expect(validateSync(dto)).toEqual([]);
  });
});
