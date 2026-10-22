import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { TopicVisibility } from '../core/topic.entity.js';

export type TopicDocument = HydratedDocument<TopicModel>;

@Schema({ timestamps: true, collection: 'topics' })
export class TopicModel {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(TopicVisibility),
    default: TopicVisibility.Private,
  })
  visibility: TopicVisibility;

  createdAt: Date;
  updatedAt: Date;
}

export const TopicSchema = SchemaFactory.createForClass(TopicModel);

TopicSchema.index(
  { userId: 1, name: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
  },
);
