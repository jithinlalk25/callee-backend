import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type CashfreeOrderDocument = HydratedDocument<CashfreeOrder>;

@Schema({ collection: 'CashfreeOrder', versionKey: false, timestamps: true })
export class CashfreeOrder {
  _id: Types.ObjectId; // order_id

  @Prop()
  response: MongooseSchema.Types.Mixed;
}

export const CashfreeOrderSchema = SchemaFactory.createForClass(CashfreeOrder);
