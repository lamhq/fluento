import { ExerciseEntity } from '../core/exercise.entity';

export class ExerciseResponseDto {
  id: string;
  scenario: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
  learnerRole?: string;
  counterpartRole?: string;
  topics: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<ExerciseResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ExerciseEntity): ExerciseResponseDto {
    return new ExerciseResponseDto({
      id: entity.id,
      scenario: entity.scenario,
      prompts: entity.prompts,
      expectedResponses: entity.expectedResponses,
      learnerRole: entity.learnerRole,
      counterpartRole: entity.counterpartRole,
      topics: entity.topics,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
