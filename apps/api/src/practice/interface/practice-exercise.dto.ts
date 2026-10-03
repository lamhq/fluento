import {
  ExerciseFormat,
  ExerciseSkill,
} from '../../content/core/exercise.entity';
import { PracticeExerciseEntity } from '../core/practice-exercise.entity';

export class PracticeExerciseDto {
  // Common exercise fields
  id: string;
  userId: string;
  name: string;
  skill: ExerciseSkill;
  format: ExerciseFormat;

  // Communication format fields
  scenario?: string;
  prompts?: string[];
  validResponses?: string[];

  // Word format fields
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];

  // Sentence format fields
  words?: string[];
  sentence?: string;

  // Paragraph format fields
  paragraph?: string;

  // Exercise context and practice progress
  topics: string[];
  references: string[];
  createdAt?: Date;
  updatedAt?: Date;
  practicedAt?: Date;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: PracticeExerciseEntity): PracticeExerciseDto {
    return new PracticeExerciseDto({
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
      sentence: entity.sentence,
      topics: entity.topics,
      references: entity.references,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      practicedAt: entity.practicedAt,
      practiceCount: entity.practiceCount,
    });
  }
}
