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

  razorpayOrderWebhookVerification(signature, rawBody) {
    let generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    console.log('=======++++++', generatedSignature, signature);

    if (generatedSignature === signature) {
      return true;
    }
    throw new Error(
      'Generated signature and received signature did not match.',
    );
  }

  @Post('razorpayOrderWebhook')
  async razorpayOrderWebhook(
    @Body() data: any,
    @Req() req: RawBodyRequest<Request>,
  ) {
    this.razorpayOrderWebhookVerification(
      req.headers['x-razorpay-signature'],
      req.rawBody,
    );

    console.log('---------------123', data);

    return await this.paymentWebhookService.razorpayOrderWebhook(
      req.headers['x-razorpay-event-id'],
      data,
    );
    // return await this.paymentWebhookService.payoutWebhook(data);
  }
}
