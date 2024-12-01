import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RazorpayOrder } from '../schema/razorpayOrder.schema';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { RazorpayService } from 'src/services/razorpay';

@Injectable()
export class PaymentWebService {
  constructor(
    @InjectModel(RazorpayOrder.name)
    private razorpayOrderModel: Model<RazorpayOrder>,
  ) {}

  async getPaymentStatus(orderId: Types.ObjectId) {
    const order: any = await this.razorpayOrderModel.findOne({ _id: orderId });

    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
    //   },
    // };

    // const response = await axios.get(
    //   `${Constant.RAZORPAY_API_URL}/v1/orders/${order.order.id}`,
    //   config,
    // );
    // console.log('Order data:', response.data);

    const orderStatus = await RazorpayService.getOrder(order.order.id);

    return {
      status: orderStatus.status === 'paid' ? 'Paid' : 'Pending',
      paymentId: orderId,
      amount: (orderStatus.amount / 100).toFixed(2),
    };
  }

  verifyRazorpaySignature(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const body = orderId + '|' + razorpayPaymentId;

    // Generate the expected signature using HMAC-SHA256
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare the generated signature with the provided one
    console.log('------------', generated_signature, razorpaySignature);
    return generated_signature === razorpaySignature;
  }

  async razorpaySuccessCallback(
    orderId: Types.ObjectId,
    razorpayOrderId: string,
    data: any,
  ) {
    console.log('==========', orderId, data);
    if (
      razorpayOrderId == data.razorpay_order_id &&
      this.verifyRazorpaySignature(
        razorpayOrderId,
        data.razorpay_payment_id,
        data.razorpay_signature,
      )
    ) {
      await this.razorpayOrderModel.updateOne(
        { _id: orderId },
        { successCallback: data },
      );
    } else {
      throw new Error('Invalid signature');
    }
  }
}
