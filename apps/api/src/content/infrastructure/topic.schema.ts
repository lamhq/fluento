import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<TopicModel>;

@Schema({ timestamps: true, collection: 'topics' })
export class TopicModel {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const TopicSchema = SchemaFactory.createForClass(TopicModel);
