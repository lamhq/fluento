import type { Entity } from '../../common/types/entity';

export enum ExerciseStatus {
  Active = 'active',
  Archived = 'archived',
}

export class ExerciseEntity implements Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  status: ExerciseStatus;
  topics: string[];
  scenario: string;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];

  constructor(data?: Partial<ExerciseEntity>) {
    Object.assign(this, data);
  }
}
