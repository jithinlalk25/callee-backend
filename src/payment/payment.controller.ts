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
import {
  GetTransactionsDto,
  SaveAddressDto,
  SaveBankAccountDto,
} from './payment.dto';
import { validate } from 'src/utils/validation';
import {
  getTransactionsVf,
  saveAddressVf,
  saveBankAccountVf,
} from './payment.validate';

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
    );
  }

  @Get('getAccount')
  async getAccount(@Request() { user }: { user: User }) {
    return await this.paymentService.getAccount(user._id);
  }

  @Post('saveAddress')
  async saveAddress(
    @Request() { user }: { user: User },
    @Body() saveAddressDto: SaveAddressDto,
  ) {
    validate(saveAddressVf, saveAddressDto);
    return await this.paymentService.saveAddress(user, saveAddressDto);
  }

  @Post('saveBankAccount')
  async saveBankAccount(
    @Request() { user }: { user: User },
    @Body() saveBankAccountDto: SaveBankAccountDto,
  ) {
    validate(saveBankAccountVf, saveBankAccountDto);
    return await this.paymentService.saveBankAccount(user, saveBankAccountDto);
  }
}
