import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

export enum AccountTypeEnum {
  BANK = 'BANK',
  UPI = 'UPI',
}

@Schema({ _id: false })
class Account {
  @Prop()
  type: AccountTypeEnum;

  @Prop()
  beneficiaryId: string;

  @Prop()
  bankAccountNumber: string;

  @Prop()
  bankIfsc: string;

  @Prop()
  vpa: string;
}

@Schema({ collection: 'Wallet', versionKey: false, timestamps: true })
export class Wallet {
  _id: Types.ObjectId; // userId

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: null })
  account: Account;

  @Prop({ default: false })
  withdrawLock: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
