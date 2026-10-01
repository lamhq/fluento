import { ExerciseEntity } from '../../content/core/exercise.entity';
import { PracticeAttemptEntity, PracticeType } from './practice-attempt.entity';

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
