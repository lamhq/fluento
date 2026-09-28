import { ExerciseEntity } from '../../../content/core/exercise.entity';

export class ExerciseDto {
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
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<ExerciseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ExerciseEntity): ExerciseDto {
    return new ExerciseDto({
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
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
