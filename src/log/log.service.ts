import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogTypeEnum } from './schema/log.schema';
import { Model, Types, Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async addLog(
    type: LogTypeEnum,
    userId: Types.ObjectId,
    data: MongooseSchema.Types.Mixed,
  ) {
    try {
      await this.logModel.create({ type, userId, data });
    } catch (error) {
      console.error('addLog Error ->', error);
    }
  }
}
