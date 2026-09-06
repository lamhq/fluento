import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ExerciseStatus } from '../../core/exercise.entity';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ _id: false })
export class ExpectedResponse {
  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  style: string[];
}

export const ExpectedResponseSchema =
  SchemaFactory.createForClass(ExpectedResponse);

@Schema({ timestamps: true, collection: 'exercises' })
export class Exercise {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ExerciseStatus),
    default: ExerciseStatus.Active,
  })
  status: ExerciseStatus;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ required: true })
  scenario: string;

  @Prop({ required: true })
  learnerRole: string;

  @Prop({ required: true })
  counterpartRole: string;

  @Prop({ type: [String], default: [] })
  prompts: string[];

  @Prop({ type: [ExpectedResponseSchema], default: [] })
  expectedResponses: ExpectedResponse[];

  createdAt: Date;
  updatedAt: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
