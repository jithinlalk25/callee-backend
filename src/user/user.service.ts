import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getOrCreateUserFromPhoneNumber(phoneNumber: string) {
    let user = await this.userModel.findOne({ phoneNumber }).exec();
    if (!user) {
      user = await this.userModel.create({ phoneNumber });
    }
    return user;
  }

  async getUser(_id: Types.ObjectId): Promise<User> {
    return await this.userModel.findOne({ _id }).exec();
  }

  async updateExpoPushToken(_id: Types.ObjectId, expoPushToken: string) {
    return await this.userModel.findOneAndUpdate({ _id }, { expoPushToken });
  }
}
