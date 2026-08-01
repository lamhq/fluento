export class ExerciseEntity {
  id: string;
  name: string;
  sentences: {
    content: string;
    style: string;
    meaning?: string | null;
  }[];
  prompts: {
    content: string;
    style: string;
    meaning?: string | null;
  }[];
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}
