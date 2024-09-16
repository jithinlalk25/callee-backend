import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.header('token');

    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userService.getUser(
      Types.ObjectId.createFromHexString(payload.userId),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const authUser = await this.authService.getAuthUser(user._id);

    const now = new Date();
    if (
      !authUser ||
      token != authUser.token ||
      now.getTime() > authUser.expiry.getTime()
    ) {
      throw new UnauthorizedException();
    }

    request['user'] = user;

    return true;
  }
}
