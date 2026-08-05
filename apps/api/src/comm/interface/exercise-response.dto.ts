import { ExerciseEntity } from '../core/exercise.entity';

export class ExerciseResponseDto {
  id: string;
  topics: string[];
  scenario: string;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<ExerciseResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ExerciseEntity): ExerciseResponseDto {
    return new ExerciseResponseDto({
      id: entity.id,
      topics: entity.topics,
      scenario: entity.scenario,
      learnerRole: entity.learnerRole,
      counterpartRole: entity.counterpartRole,
      prompts: entity.prompts,
      expectedResponses: entity.expectedResponses,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
