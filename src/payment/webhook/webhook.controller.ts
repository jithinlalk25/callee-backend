import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { PaymentWebhookService } from './webhook.service';
import * as crypto from 'crypto';

@Controller('payment-webhook')
export class PaymentWebhookController {
  constructor(private paymentWebhookService: PaymentWebhookService) {}

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
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody;
    const signature = this.verifyCashfreeWebhookSignature(
      timestamp,
      rawBody.toString(),
    );
    const receivedSignature = req.headers['x-webhook-signature'];

    if (signature !== receivedSignature) {
      console.error('Cashfree webhook signature failed');
      throw new BadRequestException();
    }
    return await this.paymentWebhookService.cashfreeWebhook(data);
  }

  payoutVerifyWebhookSignature(signature, rawBody, timestamp) {
    const body = timestamp + rawBody;
    const secretKey = process.env.CASHFREE_PAYOUT_SECRET_KEY;
    let generatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(body)
      .digest('base64');

    if (generatedSignature === signature) {
      return true;
    }
    throw new Error(
      'Generated signature and received signature did not match.',
    );
  }

  @Post('payoutWebhook')
  async payoutWebhook(
    @Body() data: any,
    @Headers('x-webhook-timestamp') timestamp: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    this.payoutVerifyWebhookSignature(
      req.headers['x-webhook-signature'],
      req.rawBody,
      timestamp,
    );

    return await this.paymentWebhookService.payoutWebhook(data);
  }
}
