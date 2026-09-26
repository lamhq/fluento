import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LearnerExerciseProgressDocument =
  HydratedDocument<LearnerExerciseProgressModel>;

@Schema({ timestamps: true, collection: 'learner_exercise_progress' })
export class LearnerExerciseProgressModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  })
  exerciseId: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  practiceCount: number;

  @Prop({ type: Date, default: Date.now })
  practicedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LearnerExerciseProgressSchema = SchemaFactory.createForClass(
  LearnerExerciseProgressModel,
);

LearnerExerciseProgressSchema.index(
  { userId: 1, exerciseId: 1 },
  { unique: true },
);
