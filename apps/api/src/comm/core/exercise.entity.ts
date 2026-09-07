import type { Entity } from '../../common/types/entity';

export enum ExerciseStatus {
  Active = 'active',
  Archived = 'archived',
}

export class ExerciseEntity implements Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  scenario: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
  learnerRole?: string;
  counterpartRole?: string;
  topics: string[];
  status: ExerciseStatus;
  userId: string;

  constructor(data?: Partial<ExerciseEntity>) {
    Object.assign(this, data);
  }
}
