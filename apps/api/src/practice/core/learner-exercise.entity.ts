import type { Entity } from '../../common/data/entity.js';

export class LearnerExerciseEntity implements Entity {
  id: string;
  userId: string;
  exerciseId: string;
  practiceCount: number;
  practicedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<LearnerExerciseEntity>) {
    Object.assign(this, data);
  }
}
