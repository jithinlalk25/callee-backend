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
import { UpdateExpoPushTokenDto } from './user.dto';
import { validate } from 'src/utils/validation';
import { updateExpoPushTokenVf } from './user.validate';
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
}
