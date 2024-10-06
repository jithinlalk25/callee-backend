import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Constant } from 'src/utils/constants';

const cashfreeHeaders = {
  'x-api-version': '2023-08-01',
  'x-client-id': process.env.CASHFREE_CLIENT_ID,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY,
};

@Injectable()
export class PaymentWebService {
  async getOrder(orderId: string) {
    try {
      const response = await axios.get(
        `${Constant.CASHFREE_API_URL}/orders/${orderId}`,
        {
          headers: cashfreeHeaders,
        },
      );

      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  async getPaymentStatus(orderId: string) {
    const order: any = await this.getOrder(orderId);
    return {
      status: order.order_status,
      paymentId: order.order_id,
      amount: order.order_amount,
    };
  }
}
