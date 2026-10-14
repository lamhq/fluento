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
    format: ExerciseFormat.COMMUNICATION,
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
    references: entity.references?.join('\n') ?? '',
  };

  switch (entity.format) {
    case ExerciseFormat.COMMUNICATION:
      return {
        ...common,
        format: ExerciseFormat.COMMUNICATION,
        scenario: entity.scenario,
        prompts: entity.prompts.join('\n'),
        validResponses: entity.validResponses.join('\n'),
      };
    case ExerciseFormat.WORD:
      return {
        ...common,
        format: ExerciseFormat.WORD,
        word: entity.word,
        meaning: entity.meaning,
        sentences: entity.sentences?.join('\n') ?? '',
        clues: entity.clues?.join('\n') ?? '',
      };
    case ExerciseFormat.SENTENCE:
      return {
        ...common,
        format: ExerciseFormat.SENTENCE,
        sentence: entity.sentence,
        scenario: entity.scenario,
        words: entity.words?.join('\n') ?? '',
      };
    case ExerciseFormat.PARAGRAPH:
      return {
        ...common,
        format: ExerciseFormat.PARAGRAPH,
        paragraph: entity.paragraph,
        scenario: entity.scenario,
        words: entity.words?.join('\n') ?? '',
      };
    default:
      throw new Error('Unsupported exercise format');
  }
}
