import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PayoutWebhookDocument = HydratedDocument<PayoutWebhook>;

@Schema({
  collection: 'PayoutWebhook',
  versionKey: false,
  timestamps: true,
  strict: false,
})
export class PayoutWebhook {
  _id: Types.ObjectId;
}

export const PayoutWebhookSchema = SchemaFactory.createForClass(PayoutWebhook);
