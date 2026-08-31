import { ExerciseEntity, ExerciseStatus } from '../core/exercise.entity';
import { ExerciseResponseDto } from './exercise-response.dto';

describe('ExerciseResponseDto', () => {
  it('maps an entity into a response DTO', () => {
    const entity: ExerciseEntity = {
      id: 'exercise-1',
      userId: 'user-1',
      status: ExerciseStatus.Active,
      topics: ['greetings'],
      scenario: 'Introductions',
      learnerRole: 'student',
      counterpartRole: 'teacher',
      prompts: ['Say hello'],
      expectedResponses: [
        {
          content: 'Hello there!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    const dto = ExerciseResponseDto.fromEntity(entity);

    expect(dto).toBeInstanceOf(ExerciseResponseDto);
    expect(dto).toEqual({
      id: 'exercise-1',
      status: ExerciseStatus.Active,
      topics: ['greetings'],
      scenario: 'Introductions',
      learnerRole: 'student',
      counterpartRole: 'teacher',
      prompts: ['Say hello'],
      expectedResponses: [
        {
          content: 'Hello there!',
          style: ['friendly'],
        },
      ],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    });
  });
});
