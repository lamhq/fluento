import type { Entity } from '../../common/types/entity';

export class PracticeAttemptEntity implements Entity {
  id: string;
  userId: string;
  exerciseId: string;
  response: string;
  score: number;
  feedback: string;
  correctness: {
    score: number;
    feedback: string;
    fixes?: string[];
    correctedResponse?: string;
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
