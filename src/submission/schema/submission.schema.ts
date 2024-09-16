import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type SubmissionDocument = HydratedDocument<Submission>;

export enum SubmissionStatusEnum {
  DATA_SUBMITTED = 'DATA_SUBMITTED',
  PAID = 'PAID',
}

@Schema({ collection: 'Submission', versionKey: false, timestamps: true })
export class Submission {
  @Prop({ index: true })
  formId: Types.ObjectId;

  @Prop()
  data: MongooseSchema.Types.Mixed;

  @Prop()
  status: SubmissionStatusEnum;

  @Prop()
  amount: number;

  @Prop()
  amountWithPlatformFee: number;

  @Prop({ index: { unique: true } })
  orderId: Types.ObjectId;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
