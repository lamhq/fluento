import { z } from 'zod';

export enum ExerciseFormat {
  Communication = 'communication',
  Word = 'word',
  Sentence = 'sentence',
  Paragraph = 'paragraph',
}

export const exerciseFormatSchema = z.enum(ExerciseFormat);

export const exerciseFormats: { label: string; value: ExerciseFormat }[] = [
  { label: 'Communication', value: ExerciseFormat.Communication },
  { label: 'Word', value: ExerciseFormat.Word },
  { label: 'Sentence', value: ExerciseFormat.Sentence },
  { label: 'Paragraph', value: ExerciseFormat.Paragraph },
];
