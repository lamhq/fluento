export class ResponseSubmissionEntity {
  id: string;
  learnerId: string;
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
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<ResponseSubmissionEntity>) {
    Object.assign(this, data);
  }
}
