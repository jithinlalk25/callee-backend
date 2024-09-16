import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Schema({ collection: 'Transaction', versionKey: false, timestamps: true })
export class Transaction {
  _id: Types.ObjectId;

  @Prop({ index: true })
  userId: Types.ObjectId;

  @Prop()
  amount: number;

  @Prop()
  type: TransactionTypeEnum;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
