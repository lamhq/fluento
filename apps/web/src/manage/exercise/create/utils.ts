import type { DefaultValues } from 'react-hook-form';

import type { Exercise } from '../../../core/types/exercise';
import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { ExerciseStatus } from '../../../core/types/exercise-status';
import type { ExerciseFormData } from './exerciseFormSchema';

export function toFormData(exercise?: Exercise): DefaultValues<ExerciseFormData> {
  const entity: Exercise = exercise ?? {
    id: '',
    name: '',
    createdAt: new Date().toISOString(),
    format: ExerciseFormat.Communication,
    skill: ExerciseSkill.COMMUNICATION,
    topics: [],
    status: ExerciseStatus.ACTIVE,
    references: [],
    scenario: '',
    prompts: [],
    validResponses: [],
  };
  const common = {
    topics: entity.topics,
    status: entity.status,
    references: entity.references ?? [],
  };

  switch (entity.format) {
    case ExerciseFormat.Communication:
      return {
        ...common,
        format: ExerciseFormat.Communication,
        scenario: entity.scenario,
        prompts: entity.prompts,
        validResponses: entity.validResponses,
      };
    case ExerciseFormat.Word:
      return {
        ...common,
        format: ExerciseFormat.Word,
        word: entity.word,
        meaning: entity.meaning,
        sentences: entity.sentences,
        clues: entity.clues,
      };
    case ExerciseFormat.Sentence:
      return {
        ...common,
        format: ExerciseFormat.Sentence,
        sentence: entity.sentence,
        scenario: entity.scenario,
        words: entity.words,
      };
    case ExerciseFormat.Paragraph:
      return {
        ...common,
        format: ExerciseFormat.Paragraph,
        paragraph: entity.paragraph,
        scenario: entity.scenario,
        words: entity.words,
      };
    default:
      throw new Error('Unsupported exercise format');
  }
}
