import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResponseSubmissionDocument = HydratedDocument<ResponseSubmission>;

@Schema({ _id: false })
export class ResponseSubmissionCorrectness {
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
export class ResponseSubmissionClarity {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class ResponseSubmissionPoliteness {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class ResponseSubmissionTone {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;
}

@Schema({ _id: false })
export class ResponseSubmissionAppropriateness {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: ResponseSubmissionClarity, required: true })
  clarity: ResponseSubmissionClarity;

  @Prop({ type: ResponseSubmissionPoliteness, required: true })
  politeness: ResponseSubmissionPoliteness;

  @Prop({ type: ResponseSubmissionTone, required: true })
  tone: ResponseSubmissionTone;
}

@Schema({ timestamps: true, collection: 'response_submissions' })
export class ResponseSubmission {
  @Prop({ required: true })
  learnerId: string;

  @Prop({ required: true })
  exerciseId: string;

  @Prop({ required: true })
  response: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: ResponseSubmissionCorrectness, required: true })
  correctness: ResponseSubmissionCorrectness;

  @Prop({ type: ResponseSubmissionAppropriateness, required: true })
  appropriateness: ResponseSubmissionAppropriateness;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ResponseSubmissionSchema =
  SchemaFactory.createForClass(ResponseSubmission);

ResponseSubmissionSchema.index({ learnerId: 1, exerciseId: 1 });
ResponseSubmissionSchema.index({ createdAt: -1 });
