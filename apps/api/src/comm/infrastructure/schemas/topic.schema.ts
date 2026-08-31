import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({ timestamps: true, collection: 'topics' })
export class Topic {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
