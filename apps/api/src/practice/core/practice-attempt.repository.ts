import { PracticeAttemptEntity } from './practice-attempt.entity';

export const PRACTICE_ATTEMPT_REPOSITORY = Symbol('PracticeAttemptRepository');

export interface PracticeAttemptRepository {
  create(data: PracticeAttemptEntity): Promise<PracticeAttemptEntity>;
}
