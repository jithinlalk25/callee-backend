import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission } from './schema/submission.schema';
import { Model, Types } from 'mongoose';
import { Order } from './schema/order.schema';
import axios from 'axios';
import { Constant } from '../../../constant';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async getAllSubmission(form: string) {
    return await this.submissionModel.find({ form });
  }

  async createOrder(amount, submissionId) {
    const order = await this.orderModel.create({ amount, submissionId });

    const params = {
      order_id: order._id.toString(),
      order_amount: order.amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'customer_id',
        customer_phone: '9999999999',
      },
    };

    const headers = {
      'x-api-version': '2023-08-01',
      'x-client-id': process.env.CASHFREE_CLIENT_ID,
      'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    };

    // console.log(
    //   '++++++++++++++',
    //   params,
    //   Constant.CASHFREE_API_URL,
    //   `${Constant.CASHFREE_API_URL}/orders`,
    // );
    // return;
    try {
      const response = await axios.post(
        `${Constant.CASHFREE_API_URL}/orders`,
        params,
        {
          headers,
        },
      );
      console.log('order=============', response);

      this.orderModel.updateOne(
        { _id: order._id },
        { cashfreeResponse: response },
      );

      return response;
    } catch (e) {
      console.log('error===========', e);
    }
  }

  async addSubmission(data: any) {
    const submission = await this.submissionModel.create({
      ...data,
      paymentStatus: 'UNPAID',
    });
    console.log('===========', submission);
    return await this.createOrder(data.amount, submission._id);
  }
}
