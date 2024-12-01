import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type RazorpayOrderDocument = HydratedDocument<RazorpayOrder>;

@Schema({ collection: 'RazorpayOrder', versionKey: false, timestamps: true })
export class RazorpayOrder {
  _id: Types.ObjectId;

  @Prop({ index: { unique: true } })
  razorpayOrderId: string;

  @Prop()
  order: MongooseSchema.Types.Mixed;

  @Prop()
  successCallback: MongooseSchema.Types.Mixed;
}

export const RazorpayOrderSchema = SchemaFactory.createForClass(RazorpayOrder);
