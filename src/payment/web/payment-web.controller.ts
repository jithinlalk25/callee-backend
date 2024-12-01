import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentWebService } from './payment-web.service';
import { Types } from 'mongoose';

@Controller('payment-web')
export class PaymentWebController {
  constructor(private paymentWebService: PaymentWebService) {}

  @Get('getPaymentStatus/:orderId')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return await this.paymentWebService.getPaymentStatus(
      new Types.ObjectId(orderId),
    );
  }

  @Post('razorpaySuccessCallback')
  async razorpaySuccessCallback(@Body() body: any) {
    return await this.paymentWebService.razorpaySuccessCallback(
      new Types.ObjectId(body.orderId),
      body.razorpayOrderId,
      body.data,
    );
  }
}
