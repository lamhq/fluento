import { ExerciseEntity } from '../../content/core/exercise.entity.js';
import { PracticeAttemptEntity } from './practice-attempt.entity.js';
import { PracticeType } from './types.js';

export interface EvaluationContext {
  exercise: ExerciseEntity;
  response: string;
  practiceType: PracticeType;
}

export type EvaluationResult = Partial<PracticeAttemptEntity> | null;

export type NextFunction = () => Promise<EvaluationResult>;

export interface EvaluationService {
  evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult>;
}
