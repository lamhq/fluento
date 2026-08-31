import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LearnerExerciseDocument = HydratedDocument<LearnerExercise>;

@Schema({ timestamps: true, collection: 'learner_exercise_practices' })
export class LearnerExercise {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ default: 0 })
  practiceCount: number;

  @Prop({ type: Date, default: Date.now })
  lastPracticeAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LearnerExerciseSchema =
  SchemaFactory.createForClass(LearnerExercise);
LearnerExerciseSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });
