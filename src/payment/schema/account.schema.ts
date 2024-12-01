import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ _id: false })
class Address {
  @Prop()
  street1: string;

  @Prop()
  street2: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  postalCode: string;
}

@Schema({ _id: false })
class BankAccount {
  @Prop()
  accountNumber: string;

  @Prop()
  ifsc: string;
}

@Schema({ collection: 'Account', versionKey: false, timestamps: true })
export class Account {
  _id: Types.ObjectId; // userId

  @Prop()
  address: Address;

  @Prop()
  bankAccount: BankAccount;

  @Prop()
  linkedAccount: MongooseSchema.Types.Mixed;

  @Prop()
  stakeholder: MongooseSchema.Types.Mixed;

  @Prop()
  productConfigRequest: MongooseSchema.Types.Mixed;

  @Prop()
  productConfigUpdate: MongooseSchema.Types.Mixed;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
