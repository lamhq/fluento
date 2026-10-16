import { z } from 'zod';

export enum PracticeType {
  COMMUNICATION = 'communication',
  USING_WORD = 'using-word',
  JUST_ONE_WORD = 'just-one-word',
  WORD_GUESSING = 'word-guessing',
  SENTENCE_CONSTRUCTION = 'sentence-construction',
  SENTENCE_VARIATION = 'sentence-variation',
  PARAGRAPH_VARIATION = 'paragraph-variation',
}

export const practiceTypeSchema = z.enum(PracticeType);
