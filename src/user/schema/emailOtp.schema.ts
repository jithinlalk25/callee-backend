import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailOtpDocument = HydratedDocument<EmailOtp>;

@Schema({ collection: 'EmailOtp', versionKey: false, timestamps: true })
export class EmailOtp {
  @Prop()
  _id: string;

  @Prop()
  otp: string;

  @Prop()
  otpCount: number;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);
