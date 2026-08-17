import { LearnerExerciseEntity } from '../core/learner-exercise.entity';

export class PracticeExerciseResponseDto {
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
  lastPracticeAt?: Date | null;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(
    entity: LearnerExerciseEntity,
  ): PracticeExerciseResponseDto {
    return new PracticeExerciseResponseDto({
      id: entity.id,
      topics: entity.topics,
      scenario: entity.scenario,
      learnerRole: entity.learnerRole,
      counterpartRole: entity.counterpartRole,
      prompts: entity.prompts,
      expectedResponses: entity.expectedResponses,
      lastPracticeAt: entity.lastPracticeAt,
      practiceCount: entity.practiceCount,
    });
  }
}
