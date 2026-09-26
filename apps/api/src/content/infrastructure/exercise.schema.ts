import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ExerciseStatus } from '../core/exercise.entity';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ timestamps: true, collection: 'exercises' })
export class Exercise {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['communication', 'vocabulary', 'articulation'],
  })
  skill: string;

  @Prop({
    required: true,
    enum: ['word', 'sentence', 'paragraph', 'communication'],
  })
  format: string;

  @Prop()
  scenario?: string;

  @Prop()
  paragraph?: string;

  @Prop({ type: [String], default: [] })
  prompts: string[];

  @Prop({ type: [String], default: [] })
  validResponses: string[];

  @Prop({ type: [String], default: [] })
  references: string[];

  @Prop()
  word?: string;

  @Prop()
  meaning?: string;

  @Prop({ type: [String], default: [] })
  clues: string[];

  @Prop({ type: [String], default: [] })
  sentences: string[];

  @Prop({ type: [String], default: [] })
  words: string[];

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({
    type: String,
    enum: Object.values(ExerciseStatus),
    default: ExerciseStatus.Active,
  })
  status: ExerciseStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
