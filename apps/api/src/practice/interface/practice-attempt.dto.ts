import { PracticeAttemptEntity } from '../core/practice-attempt.entity';
import { PracticeType } from '../core/types';

export class PracticeAttemptDto {
  id: string;
  practiceType: PracticeType;
  score: number;
  feedback: string;
  correctness?: PracticeAttemptEntity['correctness'];
  appropriateness?: PracticeAttemptEntity['appropriateness'];

  constructor(data?: Partial<PracticeAttemptDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: PracticeAttemptEntity): PracticeAttemptDto {
    return new PracticeAttemptDto({
      id: entity.id,
      practiceType: entity.practiceType,
      score: entity.score,
      feedback: entity.feedback,
      correctness: entity.correctness,
      appropriateness: entity.appropriateness,
    });
  }
}
