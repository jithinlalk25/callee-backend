import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { User } from 'src/user/schema/user.schema';
import { LoginGuard } from 'src/auth/guard/login/login.guard';
import { AddAccountDto, GetTransactionsDto } from './payment.dto';
import { validate } from 'src/utils/validation';
import { addAccountVf, getTransactionsVf } from './payment.validate';

@UseGuards(LoginGuard)
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('getTransactions')
  async getTransactions(
    @Request() { user }: { user: User },
    @Body() getTransactionsDto: GetTransactionsDto,
  ) {
    validate(getTransactionsVf, getTransactionsDto);
    return await this.paymentService.getTransactions(
      user._id,
      getTransactionsDto.page,
      getTransactionsDto.filter,
    );
  }

  @Get('getWallet')
  async getWallet(@Request() { user }: { user: User }) {
    return await this.paymentService.getWallet(user._id);
  }

  @Post('withdraw')
  async withdraw(@Request() { user }: { user: User }) {
    return await this.paymentService.withdraw(user._id);
  }

  @Post('getWithdrawals')
  async getWithdrawals(@Request() { user }: { user: User }) {
    return await this.paymentService.getWithdrawals(user._id);
  }

  @Post('addAccount')
  async addAccount(
    @Request() { user }: { user: User },
    @Body() addAccountDto: AddAccountDto,
  ) {
    validate(addAccountVf, addAccountDto);
    return await this.paymentService.addAccount(user._id, addAccountDto);
  }

  @Post('deleteAccount')
  async deleteAccount(@Request() { user }: { user: User }) {
    return await this.paymentService.deleteAccount(user._id);
  }
}
