import { Injectable } from '@nestjs/common';

import {
  type EvaluationContext,
  type EvaluationResult,
  type EvaluationService,
  type NextFunction,
} from '../../core/evaluation.service';
import { PracticeType } from '../../core/types';

/**
 * Evaluates Word Guessing practice type responses
 * Checks if the guessed word matches the target word
 */
@Injectable()
export class WordGuessingEvaluation implements EvaluationService {
  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.WordGuessing) {
      return next();
    }

    const targetWord = (context.exercise.word ?? '').toLowerCase().trim();
    const userResponse = context.response.toLowerCase().trim();

    const isCorrect = userResponse === targetWord;

    return {
      score: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? 'Correct! Well done!'
        : `The correct answer is: ${context.exercise.word ?? ''}`,
    };
  }
}
