import { ExerciseEntity } from '../../core/exercise.entity';

export class ExerciseExpectedResponseDto {
  content: string;
  style: string[];
}

export class CreateExerciseRequestDto {
  topics: string[];
  scenario: string;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: ExerciseExpectedResponseDto[];

  toEntity(): ExerciseEntity {
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
