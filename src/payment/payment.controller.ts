import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import * as crypto from 'crypto';
import { User } from 'src/user/schema/user.schema';
import { LoginGuard } from 'src/auth/guard/login/login.guard';
import { GetTransactionsDto } from './payment.dto';
import { validate } from 'src/utils/validation';
import { getTransactionsVf } from './payment.validate';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  verifyCashfreeWebhookSignature(ts: string, rawBody: string): string {
    const body = ts + rawBody;
    const genSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(body)
      .digest('base64');
    return genSignature;
  }

  @Post('cashfreeWebhook')
  async cashfreeWebhook(
    @Body() data: any,
    @Headers('x-webhook-timestamp') timestamp: string,
    @Req() req: any,
  ) {
    const rawBody = req.rawBody;
    const signature = this.verifyCashfreeWebhookSignature(timestamp, rawBody);
    const receivedSignature = req.headers['x-webhook-signature'];

    console.log('+==============', signature, receivedSignature);
    console.log('+++++++==============', timestamp);

    // if (signature !== receivedSignature) {
    //   console.error('Cashfree webhook signature failed');
    //   throw new BadRequestException();
    // }
    return await this.paymentService.cashfreeWebhook(data);
  }

  @UseGuards(LoginGuard)
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

  @UseGuards(LoginGuard)
  @Get('getWallet')
  async getWallet(@Request() { user }: { user: User }) {
    return await this.paymentService.getWallet(user._id);
  }
}
