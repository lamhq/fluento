import {
  ExerciseEntity,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity.js';

export class ExerciseSummaryDto {
  id: string;
  name: string;
  skill: ExerciseSkill;
  format: ExerciseFormat;
  topics: string[];
  references?: string[];
  createdAt: Date;
  status: ExerciseStatus;

  constructor(data?: Partial<ExerciseSummaryDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ExerciseEntity): ExerciseSummaryDto {
    return new ExerciseSummaryDto({
      id: entity.id,
      name: entity.name,
      skill: entity.skill,
      format: entity.format,
      topics: entity.topics,
      createdAt: entity.createdAt,
      status: entity.status,
    });
  }
}
