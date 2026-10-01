export interface ApiClient {
  setAccessToken(token: string): void;

  getPracticeExercise(): Promise<PaginatedResponse<PracticeExercise>>;

  submitPracticeResponse(
    exerciseId: string,
    practiceType: PracticeType,
    response: string,
  ): Promise<PracticeAttempt>;

  getExercises(options?: ExerciseQuery): Promise<[number, Exercise[]]>;
}

export type PracticeType =
  | 'communication'
  | 'using-word'
  | 'just-one-word'
  | 'word-guessing'
  | 'sentence-construction'
  | 'sentence-variation'
  | 'paragraph-variation';

export interface ExerciseQuery {
  scenario?: string;
  topics?: string[];
  status?: 'active' | 'archived' | 'all';
  sort?: string;
  offset?: number;
  limit?: number;
}

export interface PracticeExercise {
  id: string;
  format: 'communication' | 'word' | 'sentence' | 'paragraph';
  name: string;
  skill: 'communication' | 'vocabulary' | 'articulation';
  topics: string[];
  references: string[];
  type: PracticeType;
  practicedAt: string | null;
  practiceCount: number;

  // Communication format fields
  scenario?: string;
  prompts?: string[];
  validResponses?: string[];

  // Word format fields
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];

  // Sentence format fields
  sentence?: string;
  words?: string[];

  // Paragraph format fields
  paragraph?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PracticeAttempt {
  id: string;
  exerciseId: string;
  practiceType: PracticeType;
  response: string;
  score: number;
  feedback: string;
  correctness?: {
    score: number;
    feedback: string;
    fixes?: string[];
    correctedSentence?: string;
    sentences?: {
      sentence: string;
      score: number;
      feedback: string;
      fixes?: string[];
      correctedSentence?: string;
    }[];
  };
  appropriateness?: {
    score: number;
    feedback: string;
    clarity?: {
      score: number;
      feedback: string;
    };
    politeness?: {
      score: number;
      feedback: string;
    };
    tone?: {
      score: number;
      feedback: string;
    };
  };
}

export interface Exercise {
  id: string;
  name: string;
  skill: 'communication' | 'vocabulary' | 'articulation';
  format: 'communication' | 'word' | 'sentence' | 'paragraph';
  scenario?: string;
  paragraph?: string;
  prompts?: string[];
  validResponses?: string[];
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];
  words?: string[];
  sentence?: string;
  topics: string[];
  references: string[];
  status: 'active' | 'archived';
}
