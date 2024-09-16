import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CashfreeOrder } from './schema/cashfreeOrder.schema';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Constant } from 'src/utils/constants';
import { SubmissionService } from 'src/submission/submission.service';
import { CashfreeWebhook } from './schema/cashfreeWebhook.schema';
import { SubmissionStatusEnum } from 'src/submission/schema/submission.schema';
import { FormService } from 'src/form/form.service';
import { Transaction, TransactionTypeEnum } from './schema/transaction.schema';
import { Wallet } from './schema/wallet.schema';

export enum TransactionFilterEnum {
  ALL = 'ALL',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(CashfreeOrder.name)
    private cashfreeOrderModel: Model<CashfreeOrder>,
    @InjectModel(CashfreeWebhook.name)
    private cashfreeWebhookModel: Model<CashfreeWebhook>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @InjectModel(Wallet.name)
    private walletModel: Model<Wallet>,
    private submissionService: SubmissionService,
    private formService: FormService,
  ) {}

  async createOrder(amount: number) {
    const order = await this.cashfreeOrderModel.create({});

    const params = {
      order_id: order._id.toString(),
      order_amount: amount,
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

    try {
      const response = await axios.post(
        `${Constant.CASHFREE_API_URL}/orders`,
        params,
        {
          headers,
        },
      );
      console.log('order=============', response.data);

      await this.cashfreeOrderModel.updateOne(
        { _id: order._id },
        { response: response.data },
      );

      return response.data;
    } catch (e) {
      console.log('error===========', e);
    }
  }

  async cashfreeWebhook(data: any) {
    await this.cashfreeWebhookModel.create(data);
    if (data.data.payment.payment_status == 'SUCCESS') {
      const submissionExist = await this.submissionService.getSubmission(
        new Types.ObjectId(data.data.order.order_id),
        SubmissionStatusEnum.PAID,
      );
      if (!submissionExist) {
        const submission = await this.submissionService.updateSubmissionStatus(
          new Types.ObjectId(data.data.order.order_id),
          SubmissionStatusEnum.PAID,
        );
        const form = await this.formService.updateFormOnSubmission(
          submission.formId,
          submission.amount,
        );
        await this.transactionModel.create({
          userId: form.userId,
          amount: submission.amount,
          type: TransactionTypeEnum.CREDIT,
        });
        await this.walletModel.findOneAndUpdate(
          {
            _id: form.userId,
          },
          { $inc: { total: submission.amount, balance: submission.amount } },
          { upsert: true, new: true },
        );
      }
    }
    return {};
  }

  async getTransactions(
    userId: Types.ObjectId,
    page: number = 1,
    filter: TransactionFilterEnum = TransactionFilterEnum.ALL,
  ) {
    const limit = 30;
    const query = { userId };
    switch (filter) {
      case TransactionFilterEnum.CREDIT:
        query['type'] = TransactionTypeEnum.CREDIT;
        break;
      case TransactionFilterEnum.DEBIT:
        query['type'] = TransactionTypeEnum.DEBIT;
        break;
    }
    return await this.transactionModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getWallet(userId: Types.ObjectId) {
    return await this.walletModel.findOne({ _id: userId });
  }
}
