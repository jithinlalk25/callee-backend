import { Controller, Get, Param } from '@nestjs/common';
import { PaymentWebService } from './payment-web.service';
import { Types } from 'mongoose';

@Controller('payment-web')
export class PaymentWebController {
  constructor(private paymentWebService: PaymentWebService) {}

  @Get('getPaymentStatus/:orderId')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return await this.paymentWebService.getPaymentStatus(orderId);
  }
}
