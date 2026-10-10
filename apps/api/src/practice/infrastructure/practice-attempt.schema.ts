import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { PracticeType } from '../core/types.js';

export type PracticeAttemptDocument = HydratedDocument<PracticeAttemptModel>;

@Schema({ _id: false })
export class PracticeAttemptSentenceCorrectness {
  @Prop({ required: true })
  sentence: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: [String], default: [] })
  fixes: string[];

  @Prop({ required: true })
  correctedSentence: string;
}

@Schema({ _id: false })
export class PracticeAttemptCorrectness {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: [String], default: [] })
  fixes: string[];

  @Prop()
  correctedSentence?: string;

  @Prop({ type: [PracticeAttemptSentenceCorrectness] })
  sentences?: PracticeAttemptSentenceCorrectness[];
}

@Schema({ _id: false })
export class PracticeAttemptClarity {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class PracticeAttemptPoliteness {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class PracticeAttemptTone {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class PracticeAttemptAppropriateness {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: PracticeAttemptClarity })
  clarity?: PracticeAttemptClarity;

  @Prop({ type: PracticeAttemptPoliteness })
  politeness?: PracticeAttemptPoliteness;

  @Prop({ type: PracticeAttemptTone })
  tone?: PracticeAttemptTone;
}

@Schema({ timestamps: true, collection: 'practice_attempts' })
export class PracticeAttemptModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  })
  exerciseId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(PracticeType),
    required: true,
  })
  practiceType: PracticeType;

  @Prop({ required: true })
  response: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: PracticeAttemptCorrectness })
  correctness?: PracticeAttemptCorrectness;

  @Prop({ type: PracticeAttemptAppropriateness })
  appropriateness?: PracticeAttemptAppropriateness;

  createdAt: Date;
  updatedAt: Date;
}

export const PracticeAttemptSchema =
  SchemaFactory.createForClass(PracticeAttemptModel);

PracticeAttemptSchema.index({ userId: 1, exerciseId: 1 });
PracticeAttemptSchema.index({ createdAt: -1 });
