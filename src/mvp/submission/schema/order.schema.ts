import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: 'Order', versionKey: false, timestamps: true })
export class Order {
  _id: Types.ObjectId; // order_id

  @Prop()
  amount: Number;

  @Prop()
  submissionId: Types.ObjectId;

  @Prop()
  cashfreeResponse: MongooseSchema.Types.Mixed;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
