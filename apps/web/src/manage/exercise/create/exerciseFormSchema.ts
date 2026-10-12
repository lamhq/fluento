import { z } from 'zod';

import type { ExerciseFormat, ExerciseSkill } from '../../../api/types';

export const formatsBySkill: Record<ExerciseSkill, ExerciseFormat[]> = {
  communication: ['communication'],
  vocabulary: ['word'],
  articulation: ['sentence', 'paragraph'],
};

export type TextFieldName =
  | 'name'
  | 'scenario'
  | 'prompts'
  | 'validResponses'
  | 'word'
  | 'meaning'
  | 'sentences'
  | 'clues'
  | 'sentence'
  | 'paragraph'
  | 'words'
  | 'references';

export function cleanLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export const exerciseFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter an exercise name.'),
    skill: z.enum(['communication', 'vocabulary', 'articulation']).or(z.literal('')),
    format: z
      .enum(['communication', 'word', 'sentence', 'paragraph'])
      .or(z.literal('')),
    topics: z.array(z.string()),
    references: z.string(),
    status: z.enum(['active', 'archived']),
    scenario: z.string(),
    prompts: z.string(),
    validResponses: z.string(),
    word: z.string(),
    meaning: z.string(),
    sentences: z.string(),
    clues: z.string(),
    sentence: z.string(),
    paragraph: z.string(),
    words: z.string(),
  })
  .superRefine((values, context) => {
    if (!values.skill) {
      context.addIssue({
        code: 'custom',
        path: ['skill'],
        message: 'Select a skill.',
      });
      return;
    }

    if (!values.format) {
      context.addIssue({
        code: 'custom',
        path: ['format'],
        message: 'Select a format.',
      });
      return;
    }

    if (!formatsBySkill[values.skill].includes(values.format)) {
      context.addIssue({
        code: 'custom',
        path: ['format'],
        message: 'Select a format compatible with this skill.',
      });
      return;
    }

    if (!values.topics.some((topic) => topic.trim())) {
      context.addIssue({
        code: 'custom',
        path: ['topics'],
        message: 'Select or add at least one topic.',
      });
    }

    const requireText = (field: TextFieldName, label: string) => {
      if (!values[field].trim()) {
        context.addIssue({
          code: 'custom',
          path: [field],
          message: `Enter ${label}.`,
        });
      }
    };

    const requireLines = (field: TextFieldName, label: string) => {
      if (cleanLines(values[field]).length === 0) {
        context.addIssue({
          code: 'custom',
          path: [field],
          message: `Enter at least one ${label}.`,
        });
      }
    };

    switch (values.format) {
      case 'communication':
        requireText('scenario', 'a scenario');
        requireLines('prompts', 'prompt');
        requireLines('validResponses', 'valid response');
        break;
      case 'word':
        requireText('word', 'a word or phrase');
        requireText('meaning', 'a meaning');
        requireLines('sentences', 'sentence');
        requireLines('clues', 'clue');
        break;
      case 'sentence':
        requireText('scenario', 'a scenario');
        requireText('sentence', 'a sentence');
        requireLines('words', 'word or phrase');
        break;
      case 'paragraph':
        requireText('scenario', 'a scenario');
        requireText('paragraph', 'a paragraph');
        requireLines('words', 'word or phrase');
        break;
    }
  });

export type FormValues = z.infer<typeof exerciseFormSchema>;
