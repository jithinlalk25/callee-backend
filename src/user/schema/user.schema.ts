import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'User', versionKey: false, timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ index: { unique: true } })
  phoneNumber: string;

  @Prop()
  expoPushToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
