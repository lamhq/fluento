import { PracticeExerciseEntity } from '../core/practice-exercise.entity';

export class PracticeExerciseResponseDto {
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
  createdAt?: Date;
  updatedAt?: Date;
  practicedAt: Date | null;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(
    entity: PracticeExerciseEntity,
  ): PracticeExerciseResponseDto {
    return new PracticeExerciseResponseDto({
      id: entity.id,
      scenario: entity.scenario,
      prompts: entity.prompts,
      expectedResponses: entity.expectedResponses,
      learnerRole: entity.learnerRole,
      counterpartRole: entity.counterpartRole,
      topics: entity.topics,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      practicedAt: entity.practicedAt,
      practiceCount: entity.practiceCount,
    });
  }
}
