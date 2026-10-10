import {
  ExerciseEntity,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity.js';
import { ExerciseDto } from './exercise.dto.js';

describe('ExerciseDto', () => {
  it('maps an entity into a response DTO', () => {
    const entity: ExerciseEntity = {
      id: 'exercise-1',
      userId: 'user-1',
      name: 'Introductions',
      skill: ExerciseSkill.Communication,
      format: ExerciseFormat.Communication,
      status: ExerciseStatus.Active,
      topics: ['greetings'],
      references: [],
      scenario: 'Introductions',
      prompts: ['Say hello'],
      validResponses: ['Hello there!', 'Hello, how are you?'],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    const dto = ExerciseDto.fromEntity(entity);

    expect(dto).toBeInstanceOf(ExerciseDto);
    expect(dto).toEqual({
      id: 'exercise-1',
      name: 'Introductions',
      skill: ExerciseSkill.Communication,
      format: ExerciseFormat.Communication,
      topics: ['greetings'],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      status: ExerciseStatus.Active,
    });
  });
});
