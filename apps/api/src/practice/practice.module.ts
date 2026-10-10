import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContentModule } from '../content/content.module.js';
import {
  ExerciseModel,
  ExerciseSchema,
} from '../content/infrastructure/exercise.schema.js';
import { AI_SERVICE } from './core/ai.service.js';
import { EvaluationChain } from './core/evaluation-chain.js';
import { PracticeService } from './core/practice.service.js';
import { PRACTICE_ATTEMPT_REPOSITORY } from './core/practice-attempt.repository.js';
import { PRACTICE_EXERCISE_REPOSITORY } from './core/practice-exercise.repository.js';
import { CommunicationEvaluation } from './infrastructure/evaluations/communication.evaluation.js';
import { JustOneWordEvaluation } from './infrastructure/evaluations/just-one-word.evaluation.js';
import { ParagraphVariationEvaluation } from './infrastructure/evaluations/paragraph-variation.evaluation.js';
import { SentenceConstructionEvaluation } from './infrastructure/evaluations/sentence-construction.evaluation.js';
import { SentenceVariationEvaluation } from './infrastructure/evaluations/sentence-variation.evaluation.js';
import { UsingWordEvaluation } from './infrastructure/evaluations/using-word.evaluation.js';
import { WordGuessingEvaluation } from './infrastructure/evaluations/word-guessing.evaluation.js';
import {
  LearnerExerciseModel,
  LearnerExerciseSchema,
} from './infrastructure/learner-exercise.schema.js';
import { MgPracticeAttemptRepository } from './infrastructure/mg-practice-attempt.repository.js';
import { MgPracticeExerciseRepository } from './infrastructure/mg-practice-exercise.repository.js';
import { OpenAiService } from './infrastructure/openai.service.js';
import {
  PracticeAttemptModel,
  PracticeAttemptSchema,
} from './infrastructure/practice-attempt.schema.js';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises.http.controller.js';
import { SubmitResponseHttpController } from './interface/submit-response.http.controller.js';

@Module({
  imports: [
    ContentModule,
    MongooseModule.forFeature([
      { name: ExerciseModel.name, schema: ExerciseSchema },
      {
        name: LearnerExerciseModel.name,
        schema: LearnerExerciseSchema,
      },
      { name: PracticeAttemptModel.name, schema: PracticeAttemptSchema },
    ]),
  ],
  controllers: [FindPracticeExercisesHttpController, SubmitResponseHttpController],
  providers: [
    PracticeService,
    MgPracticeExerciseRepository,
    MgPracticeAttemptRepository,
    OpenAiService,
    CommunicationEvaluation,
    UsingWordEvaluation,
    JustOneWordEvaluation,
    WordGuessingEvaluation,
    SentenceConstructionEvaluation,
    SentenceVariationEvaluation,
    ParagraphVariationEvaluation,
    {
      provide: PRACTICE_EXERCISE_REPOSITORY,
      useExisting: MgPracticeExerciseRepository,
    },
    {
      provide: PRACTICE_ATTEMPT_REPOSITORY,
      useExisting: MgPracticeAttemptRepository,
    },
    {
      provide: AI_SERVICE,
      useExisting: OpenAiService,
    },
    {
      provide: EvaluationChain,
      useFactory: (
        communication: CommunicationEvaluation,
        usingWord: UsingWordEvaluation,
        justOneWord: JustOneWordEvaluation,
        wordGuessing: WordGuessingEvaluation,
        sentenceConstruction: SentenceConstructionEvaluation,
        sentenceVariation: SentenceVariationEvaluation,
        paragraphVariation: ParagraphVariationEvaluation,
      ) => {
        const chain = new EvaluationChain();
        chain.addEvaluator(communication);
        chain.addEvaluator(usingWord);
        chain.addEvaluator(justOneWord);
        chain.addEvaluator(wordGuessing);
        chain.addEvaluator(sentenceConstruction);
        chain.addEvaluator(sentenceVariation);
        chain.addEvaluator(paragraphVariation);
        return chain;
      },
      inject: [
        CommunicationEvaluation,
        UsingWordEvaluation,
        JustOneWordEvaluation,
        WordGuessingEvaluation,
        SentenceConstructionEvaluation,
        SentenceVariationEvaluation,
        ParagraphVariationEvaluation,
      ],
    },
  ],
})
export class PracticeModule {}
