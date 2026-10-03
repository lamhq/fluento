import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContentModule } from '../content/content.module';
import {
  ExerciseModel,
  ExerciseSchema,
} from '../content/infrastructure/exercise.schema';
import { AI_SERVICE } from './core/ai.service';
import { EvaluationChain } from './core/evaluation-chain';
import { PracticeService } from './core/practice.service';
import { PRACTICE_ATTEMPT_REPOSITORY } from './core/practice-attempt.repository';
import { PRACTICE_EXERCISE_REPOSITORY } from './core/practice-exercise.repository';
import { CommunicationEvaluation } from './infrastructure/evaluations/communication.evaluation';
import { JustOneWordEvaluation } from './infrastructure/evaluations/just-one-word.evaluation';
import { ParagraphVariationEvaluation } from './infrastructure/evaluations/paragraph-variation.evaluation';
import { SentenceConstructionEvaluation } from './infrastructure/evaluations/sentence-construction.evaluation';
import { SentenceVariationEvaluation } from './infrastructure/evaluations/sentence-variation.evaluation';
import { UsingWordEvaluation } from './infrastructure/evaluations/using-word.evaluation';
import { WordGuessingEvaluation } from './infrastructure/evaluations/word-guessing.evaluation';
import {
  LearnerExerciseModel,
  LearnerExerciseSchema,
} from './infrastructure/learner-exercise.schema';
import { MgPracticeAttemptRepository } from './infrastructure/mg-practice-attempt.repository';
import { MgPracticeExerciseRepository } from './infrastructure/mg-practice-exercise.repository';
import { OpenAiService } from './infrastructure/openai.service';
import {
  PracticeAttemptModel,
  PracticeAttemptSchema,
} from './infrastructure/practice-attempt.schema';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises.http.controller';
import { SubmitResponseHttpController } from './interface/submit-response.http.controller';

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
  controllers: [
    FindPracticeExercisesHttpController,
    SubmitResponseHttpController,
  ],
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
