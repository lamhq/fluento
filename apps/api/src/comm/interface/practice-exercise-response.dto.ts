import { PracticeExerciseEntity } from '../core/practice-exercise.entity';

export class PracticeExerciseResponseDto {
  id: string;
  topics: string[];
  scenario: string;
  createdAt?: Date;
  updatedAt?: Date;
  practicedAt?: Date | null;
  practiceCount: number;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];

  constructor(data?: Partial<PracticeExerciseResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(
    entity: PracticeExerciseEntity,
  ): PracticeExerciseResponseDto {
    return new PracticeExerciseResponseDto({
      id: entity.id,
      topics: entity.topics,
      scenario: entity.scenario,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      practicedAt: entity.lastPracticeAt ?? null,
      practiceCount: entity.practiceCount,
      learnerRole: entity.learnerRole,
      counterpartRole: entity.counterpartRole,
      prompts: entity.prompts,
      expectedResponses: entity.expectedResponses,
    });
  }
}
