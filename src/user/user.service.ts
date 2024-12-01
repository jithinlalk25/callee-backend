import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { SendEmailOtpDto, VerifyEmailOtpDto } from './user.dto';
import { EmailOtp } from './schema/emailOtp.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(EmailOtp.name) private emailOtpModel: Model<EmailOtp>,
  ) {}

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

  private async sendOtpEmail(email: string) {
    if (['dev', 'local'].includes(process.env.ENV)) {
      return '000000';
    } else if (process.env.ENV == 'prod' && email == 'test123@callee.app') {
      return '028619';
    }

    try {
      // const response = await axios.get(
      //   `https://2factor.in/API/V1/${process.env.SMS_API_KEY}/SMS/+91${phoneNumber}/AUTOGEN2`,
      // );
      // return response.data.OTP;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async sendEmailOtp(sendEmailOtpDto: SendEmailOtpDto) {
    const email = sendEmailOtpDto.email;

    const otp = await this.sendOtpEmail(email);

    const otpObj = await this.emailOtpModel.findOne({ _id: email }).exec();

    if (otpObj && otpObj.isBlocked) {
      throw new BadRequestException();
    }

    await this.emailOtpModel
      .findOneAndUpdate(
        { _id: email },
        {
          $set: {
            otp,
            isBlocked: otpObj ? otpObj.otpCount > 8 : false,
          },
          $inc: { otpCount: 1 },
        },
        { new: true, upsert: true },
      )
      .exec();

    return { email };
  }

  async verifyEmailOtp(
    userId: Types.ObjectId,
    verifyEmailOtpDto: VerifyEmailOtpDto,
  ) {
    const email = verifyEmailOtpDto.email;
    const otp = verifyEmailOtpDto.otp;

    const otpObj = await this.emailOtpModel.findOne({ _id: email }).exec();

    if (otp == otpObj.otp) {
      await this.emailOtpModel.deleteOne({ _id: email });

      return await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          email,
        },
        { new: true },
      );
    } else {
      throw new BadRequestException();
    }
  }

  async addName(userId: Types.ObjectId, name: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { name },
      { new: true },
    );
  }
}
