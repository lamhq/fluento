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

export interface PracticeExercise {
  id: string;
  format: 'communication' | 'word' | 'sentence' | 'paragraph';
  name: string;
  topics: string[];
  // Communication format fields
  scenario?: string;
  prompts?: string[];
  expectedResponses?: {
    content: string;
    style: string[];
  }[];
  learnerRole?: string;
  counterpartRole?: string;
  // Word format fields
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];
  // Sentence format fields
  words?: string[];
  // Paragraph format fields
  paragraph?: string;
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  practicedAt: string | null;
  practiceCount: number;
  // Presentation type for randomly chosen exercises
  presentationType?: string;
}

export interface PaginatedPracticeExercises {
  items: PracticeExercise[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SubmitResponse {
  id: string;
  exerciseId: string;
  response: string;
  score: number;
  feedback: string;
  correctness: {
    score: number;
    feedback: string;
    fixes: string[];
    correctedSentence: string;
  };
  appropriateness: {
    score: number;
    feedback: string;
    clarity: {
      score: number;
      feedback: string;
    };
    politeness: {
      score: number;
      feedback: string;
    };
    tone: {
      score: number;
      feedback: string;
    };
  };
}

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
