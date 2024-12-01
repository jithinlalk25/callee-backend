import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RazorpayOrder } from './schema/razorpayOrder.schema';
import { User } from 'src/user/schema/user.schema';
import { Account } from './schema/account.schema';
import { RazorpayService } from 'src/services/razorpay';
import { SaveAddressDto, SaveBankAccountDto } from './payment.dto';

export enum TransactionFilterEnum {
  ALL = 'ALL',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(RazorpayOrder.name)
    private razorpayOrderModel: Model<RazorpayOrder>,
    @InjectModel(Account.name)
    private accountModel: Model<Account>,
  ) {}

  async createRazorpayOrder(amount: number, amountForUser: number, notes: any) {
    try {
      const order = await RazorpayService.createOrder(
        amount,
        notes,
        'acc_P9mT1MT5gJxhjP',
        amountForUser,
      );

      return await this.razorpayOrderModel.create({
        razorpayOrderId: order.id,
        order,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Create order failed');
    }
  }

  async getTransactions(userId: Types.ObjectId, page: number = 1) {
    const account: any = await this.accountModel.findOne({ _id: userId });

    if (account?.linkedAccount?.id) {
      const payments = await RazorpayService.getLinkedAccountPayments(
        // account.linkedAccount.id,
        'acc_P9mT1MT5gJxhjP',
        page,
      );
      return payments.items.map((item) => ({
        ...item,
        amount: (item.amount / 100).toFixed(2),
      }));
    } else {
      return [];
    }
  }

  async getAccount(userId: Types.ObjectId) {
    return await this.accountModel
      .findOne({ _id: userId })
      .select('address bankAccount');
  }

  async saveAddress(user: User, address: SaveAddressDto) {
    user.email = 'test9@callee.app';
    const account: any = await this.accountModel.findOne({ _id: user._id });
    if (account.linkedAccount) {
      const linkedAccount = await RazorpayService.updateLinkedAccount(
        account.linkedAccount.id,
        {
          street1: address.street1,
          street2: address.street2,
          city: address.city,
          state: address.state,
          postal_code: Number(address.postalCode),
        },
      );
      return await this.accountModel.findOneAndUpdate(
        { _id: user._id },
        { linkedAccount, address },
        { new: true },
      );
    } else {
      const linkedAccount = await RazorpayService.createLinkedAccount(
        user.email,
        user.phoneNumber,
        user.name,
        {
          street1: address.street1,
          street2: address.street2,
          city: address.city,
          state: address.state,
          postal_code: Number(address.postalCode),
        },
      );
      return await this.accountModel.create({
        _id: user._id,
        linkedAccount,
        address,
      });
    }
  }

  async saveBankAccount(user: User, bankAccount: SaveBankAccountDto) {
    const account: any = await this.accountModel.findOne({ _id: user._id });

    if (account.bankAccount) {
      console.log('========jlk');
      const productConfigUpdate = await RazorpayService.updateProductConfig(
        account.linkedAccount.id,
        account.productConfigRequest.id,
        bankAccount.accountNumber,
        bankAccount.ifsc,
        user.name,
      );
      return await this.accountModel.findOneAndUpdate(
        { _id: user._id },
        { productConfigUpdate, bankAccount },
        { new: true },
      );
    } else {
      const stakeholder = await RazorpayService.createStakeholder(
        account.linkedAccount.id,
        user.email,
        user.name,
      );
      await this.accountModel.findOneAndUpdate(
        { _id: user._id },
        { stakeholder },
        { new: true },
      );

      const productConfigRequest = await RazorpayService.requestProductConfig(
        account.linkedAccount.id,
      );
      await this.accountModel.findOneAndUpdate(
        { _id: user._id },
        { productConfigRequest },
        { new: true },
      );

      const productConfigUpdate = await RazorpayService.updateProductConfig(
        account.linkedAccount.id,
        productConfigRequest.id,
        bankAccount.accountNumber,
        bankAccount.ifsc,
        user.name,
      );
      return await this.accountModel.findOneAndUpdate(
        { _id: user._id },
        { productConfigUpdate, bankAccount },
        { new: true },
      );
    }
  }
}
