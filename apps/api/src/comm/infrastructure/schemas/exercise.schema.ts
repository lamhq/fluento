import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
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

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
