import { ExerciseEntity } from '../../core/exercise.entity';
import { ExerciseExpectedResponseDto } from '../create-exercise/create-exercise-request.dto';

export class UpdateExerciseRequestDto {
  topics?: string[];
  scenario?: string;
  learnerRole?: string;
  counterpartRole?: string;
  prompts?: string[];
  expectedResponses?: ExerciseExpectedResponseDto[];

  toEntity(): Partial<ExerciseEntity> {
    return new ExerciseEntity({
      topics: this.topics,
      scenario: this.scenario,
      learnerRole: this.learnerRole,
      counterpartRole: this.counterpartRole,
      prompts: this.prompts,
      expectedResponses: this.expectedResponses,
    });
  }
}
