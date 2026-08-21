export class ExerciseEntity {
  id: string;
  topics: string[];
  scenario: string;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<ExerciseEntity>) {
    Object.assign(this, data);
  }
}
