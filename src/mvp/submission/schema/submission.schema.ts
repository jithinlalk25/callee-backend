import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema({ collection: 'Submission', versionKey: false, timestamps: true })
export class Submission {
  @Prop()
  form: string;

  @Prop()
  name: string;

  @Prop()
  flatNo: string;

  @Prop()
  headCount: number;

  @Prop()
  amount: number;

  @Prop()
  paymentStatus: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
