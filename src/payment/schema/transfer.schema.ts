import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type TransferDocument = HydratedDocument<Transfer>;

export enum TransferStatusEnum {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

@Schema({ collection: 'Transfer', versionKey: false, timestamps: true })
export class Transfer {
  _id: Types.ObjectId;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  amount: Types.ObjectId;

  @Prop()
  bodyParams: MongooseSchema.Types.Mixed;

  @Prop()
  response: MongooseSchema.Types.Mixed;

  @Prop({ default: TransferStatusEnum.INITIATED })
  status: TransferStatusEnum;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
