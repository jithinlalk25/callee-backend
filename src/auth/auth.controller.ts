import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { validate } from 'src/utils/validation';
import { sendOtpVf, verifyOtpVf } from './auth.validate';
import { LoginGuard } from './guard/login/login.guard';
import { User } from 'src/user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sendOtp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    validate(sendOtpVf, sendOtpDto);
    return await this.authService.sendOtp(sendOtpDto);
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    validate(verifyOtpVf, verifyOtpDto);
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(LoginGuard)
  @Post('logout')
  async logout(@Request() { user }: { user: User }) {
    return await this.authService.logout(user._id);
  }
}
