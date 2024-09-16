import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CashfreeWebhookDocument = HydratedDocument<CashfreeWebhook>;

@Schema({
  collection: 'CashfreeWebhook',
  versionKey: false,
  timestamps: true,
  strict: false,
})
export class CashfreeWebhook {
  _id: Types.ObjectId;
}

export const CashfreeWebhookSchema =
  SchemaFactory.createForClass(CashfreeWebhook);
