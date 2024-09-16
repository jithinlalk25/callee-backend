import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './schema/otp.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './schema/authUser.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(AuthUser.name) private authUserModel: Model<AuthUser>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getAuthUser(_id: Types.ObjectId): Promise<AuthUser> {
    return await this.authUserModel.findOne({ _id }).exec();
  }

  async logout(_id: Types.ObjectId) {
    await this.authUserModel.deleteOne({ _id }).exec();
    return {};
  }

  private async sendWhatsAppOtp(phoneNumber: string) {
    if (['dev', 'local'].includes(process.env.ENV)) {
      return '000000';
    } else if (process.env.ENV == 'prod' && phoneNumber == '0000000000') {
      return '000000';
    }

    try {
      return '000000';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const phoneNumber = sendOtpDto.phoneNumber;

    const otp = await this.sendWhatsAppOtp(phoneNumber);

    const otpObj = await this.otpModel.findOne({ _id: phoneNumber }).exec();

    if (otpObj && otpObj.isBlocked) {
      throw new BadRequestException();
    }

    await this.otpModel
      .findOneAndUpdate(
        { _id: phoneNumber },
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

    return { phoneNumber };
  }

  private async createToken(userId: Types.ObjectId) {
    return await this.jwtService.signAsync({ userId: userId });
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const phoneNumber = verifyOtpDto.phoneNumber;
    const otp = verifyOtpDto.otp;

    const otpObj = await this.otpModel.findOne({ _id: phoneNumber }).exec();

    if (otp == otpObj.otp) {
      await this.otpModel.deleteOne({ _id: phoneNumber });
      const user =
        await this.userService.getOrCreateUserFromPhoneNumber(phoneNumber);
      const token = await this.createToken(user._id);
      const now = new Date();
      const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; // Milliseconds in 30 days
      const expiry = new Date(now.getTime() + thirtyDaysInMilliseconds);

      await this.authUserModel
        .findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              token,
              expiry,
            },
          },
          { new: true, upsert: true },
        )
        .exec();

      return {
        token,
      };
    } else {
      throw new BadRequestException();
    }
  }
}
