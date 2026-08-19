import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ExercisePracticeDocument = HydratedDocument<ExercisePractice>;

@Schema({ timestamps: true, collection: 'learner_exercise_practices' })
export class ExercisePractice {
  @Prop({ required: true })
  learnerId: string;

  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ default: 0 })
  practiceCount: number;

  @Prop({ type: Date, default: Date.now })
  lastPracticeAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExercisePracticeSchema =
  SchemaFactory.createForClass(ExercisePractice);
ExercisePracticeSchema.index({ learnerId: 1, exerciseId: 1 }, { unique: true });
