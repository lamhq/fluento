import { PracticeAttemptEntity } from '../core/practice-attempt.entity';
import { PracticeType } from '../core/types';

export class PracticeAttemptDto {
  id: string;
  exerciseId: string;
  practiceType: PracticeType;
  response: string;
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
      exerciseId: entity.exerciseId,
      practiceType: entity.practiceType,
      response: entity.response,
      score: entity.score,
      feedback: entity.feedback,
      correctness: entity.correctness,
      appropriateness: entity.appropriateness,
    });
  }
}
