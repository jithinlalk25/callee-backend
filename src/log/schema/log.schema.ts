import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

export enum LogTypeEnum {
  ERROR = 'ERROR',
  INFO = 'INFO',
}

@Schema({
  collection: 'Log',
  versionKey: false,
  timestamps: { updatedAt: false, createdAt: true },
})
export class Log {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  type: LogTypeEnum;

  @Prop()
  data: MongooseSchema.Types.Mixed;
}

export const LogSchema = SchemaFactory.createForClass(Log);
