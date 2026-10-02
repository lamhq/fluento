import type { PracticeExercise, PracticeType } from './types';

export function selectPracticeType(
  format: PracticeExercise['format'],
): PracticeType {
  switch (format) {
    case 'communication':
      return 'communication';
    case 'word': {
      const types: PracticeType[] = ['using-word', 'just-one-word', 'word-guessing'];
      return types[Math.floor(Math.random() * types.length)];
    }
    case 'sentence': {
      const types: PracticeType[] = ['sentence-construction', 'sentence-variation'];
      return types[Math.floor(Math.random() * types.length)];
    }
    case 'paragraph':
      return 'paragraph-variation';
    default:
      throw new Error('Unsupported exercise format');
  }
}
