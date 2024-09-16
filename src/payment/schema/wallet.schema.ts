import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ collection: 'Wallet', versionKey: false, timestamps: true })
export class Wallet {
  _id: Types.ObjectId; // userId

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  balance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
