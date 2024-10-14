import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CashfreeOrder } from './schema/cashfreeOrder.schema';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Constant } from 'src/utils/constants';
import { Transaction, TransactionTypeEnum } from './schema/transaction.schema';
import { AccountTypeEnum, Wallet } from './schema/wallet.schema';
import { AddAccountDto } from './payment.dto';
import { Transfer, TransferStatusEnum } from './schema/transfer.schema';

export enum TransactionFilterEnum {
  ALL = 'ALL',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

const cashfreeHeaders = {
  'x-api-version': '2023-08-01',
  'x-client-id': process.env.CASHFREE_CLIENT_ID,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY,
};

const cashfreePayoutHeaders = {
  'x-api-version': '2024-01-01',
  'x-client-id': process.env.CASHFREE_PAYOUT_CLIENT_ID,
  'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET_KEY,
};

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(CashfreeOrder.name)
    private cashfreeOrderModel: Model<CashfreeOrder>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @InjectModel(Wallet.name)
    private walletModel: Model<Wallet>,
    @InjectModel(Transfer.name)
    private transferModel: Model<Transfer>,
  ) {}

  async createOrder(amount: number, customerDetails: any, orderTags: any) {
    const order = await this.cashfreeOrderModel.create({});

    const params = {
      order_id: order._id.toString(),
      order_amount: amount,
      order_currency: 'INR',
      customer_details: customerDetails,
      order_tags: orderTags,
      order_meta: {
        return_url:
          process.env.ENV == 'prod'
            ? `https://callee.app/payment-status/${order._id.toString()}`
            : `http://localhost:3001/payment-status/${order._id.toString()}`,
      },
    };

    try {
      const response = await axios.post(
        `${Constant.CASHFREE_API_URL}/orders`,
        params,
        {
          headers: cashfreeHeaders,
        },
      );

      await this.cashfreeOrderModel.updateOne(
        { _id: order._id },
        { response: response.data },
      );

      return response.data;
    } catch (e) {
      console.error(e);
    }
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
    let wallet = await this.walletModel.findOne({ _id: userId });
    if (!wallet) {
      wallet = await this.walletModel.create({ _id: userId });
    }
    return wallet;
  }

  async transfer(userId: Types.ObjectId) {
    const wallet = await this.walletModel.findOne({ _id: userId });
    if (wallet.withdrawLock) {
      throw new Error('Withdrawal locked');
    }
    if (!wallet.account) {
      throw new Error("Account doesn't exist");
    }

    await this.walletModel.updateOne({ _id: userId }, { withdrawLock: true });

    const transfer = await this.transferModel.create({
      userId,
      amount: wallet.balance,
    });

    const params = {
      transfer_id: transfer._id.toString(),
      transfer_amount: transfer.amount,
      beneficiary_details: {
        beneficiary_id: wallet.account.beneficiaryId,
      },
    };

    await this.transferModel.updateOne(
      { _id: transfer._id },
      { bodyParams: params },
    );
    try {
      const response = await axios.post(
        `${Constant.CASHFREE_PAYOUT_API_URL}/transfers`,
        params,
        {
          headers: cashfreePayoutHeaders,
        },
      );

      await this.transferModel.updateOne(
        { _id: transfer._id },
        { response: response.data, status: TransferStatusEnum.PENDING },
      );

      await this.walletModel.updateOne(
        { _id: userId },
        { withdrawLock: false, $inc: { balance: -transfer.amount } },
      );
    } catch (e) {
      await this.walletModel.updateOne(
        { _id: userId },
        { withdrawLock: false },
      );
      console.error(e);
      throw new Error('Trasfer failed');
    }
  }

  async withdraw(userId: Types.ObjectId) {
    await this.transfer(userId);
  }

  async getWithdrawals(userId: Types.ObjectId) {
    return await this.transferModel
      .find({
        userId,
        status: {
          $in: [
            TransferStatusEnum.PENDING,
            TransferStatusEnum.FAILED,
            TransferStatusEnum.SUCCESS,
          ],
        },
      })
      .sort({ createdAt: -1 })
      .select('amount status createdAt');
  }

  async addAccount(userId: Types.ObjectId, data: AddAccountDto) {
    const accountDetails =
      data.type == AccountTypeEnum.BANK
        ? {
            bank_account_number: data.bankAccountNumber,
            bank_ifsc: data.bankIfsc,
          }
        : {
            vpa: data.vpa,
          };
    try {
      const beneficiaryId = userId.toString() + Date.now().toString();

      const response = await axios.post(
        `${Constant.CASHFREE_PAYOUT_API_URL}/beneficiary`,
        {
          beneficiary_instrument_details: accountDetails,
          beneficiary_id: beneficiaryId,
          beneficiary_name: 'Name Placeholder',
        },
        {
          headers: cashfreePayoutHeaders,
        },
      );

      return await this.walletModel.findOneAndUpdate(
        { _id: userId },
        { $set: { account: { ...data, beneficiaryId } } },
        { new: true },
      );

      // return response.data;
    } catch (e) {
      console.error(e);
      throw new Error('Add account failed');
    }
  }

  async deleteAccount(userId: Types.ObjectId) {
    return await this.walletModel.findOneAndUpdate(
      { _id: userId },
      { $set: { account: null } },
      { new: true },
    );
  }
}
