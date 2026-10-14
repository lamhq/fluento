import {
  ExerciseEntity,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity.js';

export class ExerciseDto {
  id: string;
  name: string;
  skill: ExerciseSkill;
  format: ExerciseFormat;
  topics: string[];
  references?: string[];
  createdAt: Date;
  status: ExerciseStatus;
  scenario?: string;
  prompts?: string[];
  validResponses?: string[];
  paragraph?: string;
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];
  words?: string[];
  sentence?: string;

  constructor(data?: Partial<ExerciseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ExerciseEntity): ExerciseDto {
    const common = {
      id: entity.id,
      name: entity.name,
      skill: entity.skill,
      format: entity.format,
      topics: entity.topics,
      references: entity.references,
      createdAt: entity.createdAt,
      status: entity.status,
    };

    switch (entity.format) {
      case ExerciseFormat.Communication:
        return new ExerciseDto({
          ...common,
          scenario: entity.scenario,
          prompts: entity.prompts,
          validResponses: entity.validResponses,
        });
      case ExerciseFormat.Word:
        return new ExerciseDto({
          ...common,
          word: entity.word,
          meaning: entity.meaning,
          sentences: entity.sentences,
          clues: entity.clues,
        });
      case ExerciseFormat.Sentence:
        return new ExerciseDto({
          ...common,
          scenario: entity.scenario,
          sentence: entity.sentence,
          words: entity.words,
        });
      case ExerciseFormat.Paragraph:
        return new ExerciseDto({
          ...common,
          scenario: entity.scenario,
          paragraph: entity.paragraph,
          words: entity.words,
        });
    }
  }
}
