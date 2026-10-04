import type { Entity } from '../../common/data/entity';
import { PracticeType } from './types';

export class PracticeAttemptEntity implements Entity {
  id: string;
  userId: string;
  exerciseId: string;
  practiceType: PracticeType;
  response: string;
  score: number;
  feedback: string;
  correctness?: {
    score: number;
    feedback: string;
    fixes?: string[];
    correctedSentence?: string;
    sentences?: {
      sentence: string;
      score: number;
      feedback: string;
      fixes?: string[];
      correctedSentence?: string;
    }[];
  };
  appropriateness?: {
    score: number;
    feedback: string;
    clarity?: {
      score: number;
      feedback: string;
    };
    politeness?: {
      score: number;
      feedback: string;
    };
    tone?: {
      score: number;
      feedback: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<PracticeAttemptEntity>) {
    Object.assign(this, data);
  }
}
