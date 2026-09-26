import type { Entity } from '../../common/types/entity';

export enum ExerciseStatus {
  Active = 'active',
  Archived = 'archived',
}

export enum ExerciseSkill {
  Communication = 'communication',
  Vocabulary = 'vocabulary',
  Articulation = 'articulation',
}

export enum ExerciseFormat {
  Communication = 'communication',
  Word = 'word',
  Sentence = 'sentence',
  Paragraph = 'paragraph',
}

export class ExerciseEntity implements Entity {
  id: string;
  userId: string;
  status: ExerciseStatus;
  name: string;
  skill: ExerciseSkill;
  format: ExerciseFormat;
  topics: string[];
  references: string[];
  createdAt: Date;
  updatedAt: Date;

  // Communication format fields
  scenario?: string;
  prompts?: string[];
  validResponses?: string[];

  // Paragraph format fields
  paragraph?: string;

  // Word format fields
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];

  // Sentence and Paragraph format fields
  words?: string[];

  constructor(data?: Partial<ExerciseEntity>) {
    Object.assign(this, data);
  }
}
