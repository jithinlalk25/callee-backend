import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from './schema/user.schema';
import { LoginGuard } from 'src/auth/guard/login/login.guard';
import {
  AddNameDto,
  SendEmailOtpDto,
  UpdateExpoPushTokenDto,
  VerifyEmailOtpDto,
} from './user.dto';
import { validate } from 'src/utils/validation';
import {
  addNameVf,
  sendEmailOtpVf,
  updateExpoPushTokenVf,
  verifyEmailOtpVf,
} from './user.validate';
import { UserService } from './user.service';

@UseGuards(LoginGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async get(@Request() { user }: { user: User }) {
    return user;
  }

  @Post('updateExpoPushToken')
  async updateExpoPushToken(
    @Request() { user }: { user: User },
    @Body() updateExpoPushTokenDto: UpdateExpoPushTokenDto,
  ) {
    validate(updateExpoPushTokenVf, updateExpoPushTokenDto);
    return await this.userService.updateExpoPushToken(
      user._id,
      updateExpoPushTokenDto.expoPushToken,
    );
  }

  @Post('sendEmailOtp')
  async sendEmailOtp(@Body() sendEmailOtpDto: SendEmailOtpDto) {
    validate(sendEmailOtpVf, sendEmailOtpDto);
    return await this.userService.sendEmailOtp(sendEmailOtpDto);
  }

  @Post('verifyEmailOtp')
  async verifyEmailOtp(
    @Request() { user }: { user: User },
    @Body() verifyEmailOtpDto: VerifyEmailOtpDto,
  ) {
    validate(verifyEmailOtpVf, verifyEmailOtpDto);
    return await this.userService.verifyEmailOtp(user._id, verifyEmailOtpDto);
  }

  @Post('addName')
  async addName(
    @Request() { user }: { user: User },
    @Body() addNameDto: AddNameDto,
  ) {
    validate(addNameVf, addNameDto);
    return await this.userService.addName(user._id, addNameDto.name);
  }
}
