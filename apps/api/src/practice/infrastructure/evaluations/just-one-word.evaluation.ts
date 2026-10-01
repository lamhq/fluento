import { Injectable } from '@nestjs/common';

import {
  type EvaluationContext,
  type EvaluationResult,
  type EvaluationService,
  type NextFunction,
} from '../../core/evaluation.service';
import { PracticeType } from '../../core/types';

/**
 * Evaluates Just One Word practice type responses
 * Checks if the guessed word matches the target word
 */
@Injectable()
export class JustOneWordEvaluation implements EvaluationService {
  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.JustOneWord) {
      return next();
    }

    const targetWord = (context.exercise.word ?? '').toLowerCase().trim();
    const userResponse = context.response.toLowerCase().trim();

    const isCorrect = userResponse === targetWord;

    return {
      score: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? 'Correct! Great job!'
        : `The correct answer is: ${context.exercise.word ?? ''}`,
    };
  }
}
