import type { Entity } from '../../common/types/entity';

export class LearnerExerciseProgressEntity implements Entity {
  id: string;
  userId: string;
  exerciseId: string;
  practiceCount: number;
  practicedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<LearnerExerciseProgressEntity>) {
    Object.assign(this, data);
  }
}
