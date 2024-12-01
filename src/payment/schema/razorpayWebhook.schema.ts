import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type RazorpayWebhookDocument = HydratedDocument<RazorpayWebhook>;

@Schema({
  collection: 'RazorpayWebhook',
  versionKey: false,
  timestamps: true,
})
export class RazorpayWebhook {
  @Prop()
  _id: string; // eventId

  @Prop()
  data: MongooseSchema.Types.Mixed;
}

export const RazorpayWebhookSchema =
  SchemaFactory.createForClass(RazorpayWebhook);
