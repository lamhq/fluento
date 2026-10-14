import { z } from 'zod';

export enum ExerciseFormat {
  COMMUNICATION = 'communication',
  WORD = 'word',
  SENTENCE = 'sentence',
  PARAGRAPH = 'paragraph',
}

export const exerciseFormatSchema = z.enum(ExerciseFormat);

export const exerciseFormats: { label: string; value: ExerciseFormat }[] = [
  { label: 'Communication', value: ExerciseFormat.COMMUNICATION },
  { label: 'Word', value: ExerciseFormat.WORD },
  { label: 'Sentence', value: ExerciseFormat.SENTENCE },
  { label: 'Paragraph', value: ExerciseFormat.PARAGRAPH },
];
