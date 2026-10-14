import { ExerciseFormat } from '../core/types/exercise-format';
import { PracticeType } from '../core/types/practice-type';

export function selectPracticeType(format: ExerciseFormat): PracticeType {
  switch (format) {
    case ExerciseFormat.COMMUNICATION:
      return PracticeType.COMMUNICATION;
    case ExerciseFormat.WORD: {
      const types: PracticeType[] = [
        PracticeType.USING_WORD,
        PracticeType.JUST_ONE_WORD,
        PracticeType.WORD_GUESSING,
      ];
      return types[Math.floor(Math.random() * types.length)];
    }
    case ExerciseFormat.SENTENCE: {
      const types: PracticeType[] = [
        PracticeType.SENTENCE_CONSTRUCTION,
        PracticeType.SENTENCE_VARIATION,
      ];
      return types[Math.floor(Math.random() * types.length)];
    }
    case ExerciseFormat.PARAGRAPH:
      return PracticeType.PARAGRAPH_VARIATION;
    default:
      throw new Error('Unsupported exercise format');
  }
}
