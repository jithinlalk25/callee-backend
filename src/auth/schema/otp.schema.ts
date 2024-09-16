import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ collection: 'Otp', versionKey: false, timestamps: true })
export class Otp {
  @Prop()
  _id: string;

  @Prop()
  otp: string;

  @Prop()
  otpCount: number;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
