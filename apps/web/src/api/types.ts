import { z } from 'zod';

export interface ApiClient {
  setAccessToken(token: string): void;

  getPracticeExercise(): Promise<PaginatedPracticeExercises>;

  submitPracticeResponse(
    exerciseId: string,
    response: string,
  ): Promise<SubmitResponse>;

  getExercises(options?: {
    scenario?: string;
    topics?: string[];
    status?: 'active' | 'archived' | 'all';
    sort?: string;
    offset?: number;
    limit?: number;
  }): Promise<[number, ExerciseResponseDto[]]>;
}

export const PracticeExerciseSchema = z.object({
  id: z.string(),
  scenario: z.string(),
  prompts: z.array(z.string()).min(1, 'Exercise prompts must not be empty.'),
  expectedResponses: z.array(
    z.object({
      content: z.string(),
      style: z.array(z.string()),
    }),
  ),
  learnerRole: z.string().optional(),
  counterpartRole: z.string().optional(),
  topics: z.array(z.string()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  practicedAt: z.string().nullable(),
  practiceCount: z.number().default(0),
});

export const PaginatedPracticeExercisesSchema = z.object({
  items: z.array(PracticeExerciseSchema),
  nextCursor: z.string().nullable(),
  previousCursor: z.string().nullable(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const SubmitResponseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  response: z.string(),
  score: z.number(),
  feedback: z.string(),
  correctness: z.object({
    score: z.number(),
    feedback: z.string(),
    fixes: z.array(z.string()),
    correctedSentence: z.string(),
  }),
  appropriateness: z.object({
    score: z.number(),
    feedback: z.string(),
    clarity: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    politeness: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    tone: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
});

export type PracticeExercise = z.infer<typeof PracticeExerciseSchema>;

export type PaginatedPracticeExercises = z.infer<
  typeof PaginatedPracticeExercisesSchema
>;

export type SubmitResponse = z.infer<typeof SubmitResponseSchema>;

export interface ExerciseResponseDto {
  id: string;
  scenario: string;
  topics: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  learnerRole?: string;
  counterpartRole?: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
}

export interface PracticeExercisesResponse {
  items: PracticeExerciseResponseDto[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PracticeExerciseResponseDto {
  id: string;
  scenario: string;
  topics: string[];
  createdAt?: string;
  updatedAt?: string;
  practicedAt: string | null;
  practiceCount: number;
  learnerRole?: string;
  counterpartRole?: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
}
