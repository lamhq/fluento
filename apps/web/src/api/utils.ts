import { ExerciseFormat } from '../core/types/exercise-format';
import type { PracticeExercise } from '../core/types/practice-exercise';
import { PracticeType } from '../core/types/practice-type';

type Exercise = Pick<PracticeExercise, 'format'> & {
  clues?: string[];
  words?: string[];
};

export function selectPracticeType(exercise: Exercise): PracticeType {
  switch (exercise.format) {
    case ExerciseFormat.Communication:
      return PracticeType.COMMUNICATION;
    case ExerciseFormat.Word: {
      const types: PracticeType[] = [
        PracticeType.USING_WORD,
        PracticeType.WORD_GUESSING,
      ];
      if (Array.isArray(exercise.clues) && exercise.clues.length > 0) {
        types.push(PracticeType.JUST_ONE_WORD);
      }
      return types[Math.floor(Math.random() * types.length)];
    }
    case ExerciseFormat.Sentence: {
      const types: PracticeType[] = [PracticeType.SENTENCE_VARIATION];
      if (Array.isArray(exercise.words) && exercise.words.length > 0) {
        types.push(PracticeType.SENTENCE_CONSTRUCTION);
      }
      return types[Math.floor(Math.random() * types.length)];
    }
    case ExerciseFormat.Paragraph:
      return PracticeType.PARAGRAPH_VARIATION;
    default:
      throw new Error('Unsupported exercise format');
  }
}
