import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({ timestamps: true, collection: 'topics' })
export class Topic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId?: mongoose.Types.ObjectId;

  @Prop({ required: true, index: true })
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
