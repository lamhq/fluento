import {
  ExerciseEntity,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity';

export class ExerciseDto {
  id: string;
  name: string;
  skill: ExerciseSkill;
  format: ExerciseFormat;
  topics: string[];
  createdAt: Date;
  status: ExerciseStatus;

  constructor(data?: Partial<ExerciseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: ExerciseEntity): ExerciseDto {
    return new ExerciseDto({
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
