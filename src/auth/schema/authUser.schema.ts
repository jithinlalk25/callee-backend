import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthUserDocument = HydratedDocument<AuthUser>;

@Schema({ collection: 'AuthUser', versionKey: false, timestamps: true })
export class AuthUser {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  token: string;

  @Prop()
  expiry: Date;
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser);
