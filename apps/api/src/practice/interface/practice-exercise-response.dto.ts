import { PracticeExerciseView } from '../core/practice-exercise.view';

export class PracticeExerciseResponseDto {
  id: string;
  userId: string;
  name: string;
  skill: string;
  format: string;
  scenario?: string;
  paragraph?: string;
  prompts?: string[];
  validResponses?: string[];
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];
  words?: string[];
  topics: string[];
  references: string[];
  createdAt?: Date;
  updatedAt?: Date;
  practicedAt?: Date;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: PracticeExerciseView): PracticeExerciseResponseDto {
    return new PracticeExerciseResponseDto({
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      skill: entity.skill,
      format: entity.format,
      scenario: entity.scenario,
      paragraph: entity.paragraph,
      prompts: entity.prompts,
      validResponses: entity.validResponses,
      word: entity.word,
      meaning: entity.meaning,
      clues: entity.clues,
      sentences: entity.sentences,
      words: entity.words,
      topics: entity.topics,
      references: entity.references,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      practicedAt: entity.practicedAt,
      practiceCount: entity.practiceCount,
    });
  }
}
