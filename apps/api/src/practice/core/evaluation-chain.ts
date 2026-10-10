import { Injectable } from '@nestjs/common';

import {
  type EvaluationContext,
  type EvaluationResult,
  type EvaluationService,
} from '../core/evaluation.service.js';

/**
 * Composes and executes evaluation middleware chain
 */
@Injectable()
export class EvaluationChain {
  private evaluators: EvaluationService[] = [];

  /**
   * Add an evaluator to the chain
   */
  addEvaluator(evaluator: EvaluationService): this {
    this.evaluators.push(evaluator);
    return this;
  }

  /**
   * Execute the evaluation chain
   * Throws error if no evaluator can handle the request
   */
  async evaluate(context: EvaluationContext): Promise<EvaluationResult> {
    let currentIndex = 0;

    const next = async (): Promise<EvaluationResult> => {
      if (currentIndex >= this.evaluators.length) {
        throw new Error(
          `No evaluator found for practice type: ${context.practiceType}`,
        );
      }

      const evaluator = this.evaluators[currentIndex];
      currentIndex += 1;

      return evaluator.evaluate(context, next);
    };

    return next();
  }
}
