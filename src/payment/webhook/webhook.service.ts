import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transfer, TransferStatusEnum } from '../schema/transfer.schema';
import { Model, Types } from 'mongoose';
import { PayoutWebhook } from '../schema/payoutWebhook.schema';
import { Transaction, TransactionTypeEnum } from '../schema/transaction.schema';
import { Wallet } from '../schema/wallet.schema';
import { sendPushNotifications } from 'src/utils/notification';
import { SubmissionService } from 'src/submission/submission.service';
import { FormService } from 'src/form/form.service';
import { UserService } from 'src/user/user.service';
import { SubmissionStatusEnum } from 'src/submission/schema/submission.schema';
import { CashfreeWebhook } from '../schema/cashfreeWebhook.schema';

@Injectable()
export class PaymentWebhookService {
  constructor(
    @InjectModel(Transfer.name) private transferModel: Model<Transfer>,
    @InjectModel(PayoutWebhook.name)
    private payoutWebhookModel: Model<PayoutWebhook>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @InjectModel(Wallet.name)
    private walletModel: Model<Wallet>,
    @InjectModel(CashfreeWebhook.name)
    private cashfreeWebhookModel: Model<CashfreeWebhook>,
    private submissionService: SubmissionService,
    private formService: FormService,
    private userService: UserService,
  ) {}

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
        const user = await this.userService.getUser(form.userId);
        if (user.expoPushToken) {
          await sendPushNotifications(
            `₹${submission.amount} received for ${form.title}`,
            [user.expoPushToken],
          );
        }
      }
    }
    return {};
  }

  async payoutWebhook(data: any) {
    await this.payoutWebhookModel.create(data);
    const transfer = await this.transferModel.findOne({
      _id: new Types.ObjectId(data.data.transfer_id),
    });

    switch (data.type) {
      case 'TRANSFER_SUCCESS':
        if (transfer.status != TransferStatusEnum.SUCCESS) {
          await this.transferModel.updateOne(
            { _id: transfer._id },
            { status: TransferStatusEnum.SUCCESS },
          );
          await this.transactionModel.create({
            userId: transfer.userId,
            amount: transfer.amount,
            type: TransactionTypeEnum.DEBIT,
          });
        }
        break;
      case 'TRANSFER_FAILED':
      case 'TRANSFER_REVERSED':
      case 'TRANSFER_REJECTED':
        if (transfer.status != TransferStatusEnum.FAILED) {
          await this.transferModel.updateOne(
            { _id: transfer._id },
            { status: TransferStatusEnum.FAILED },
          );
          await this.walletModel.updateOne(
            { _id: transfer.userId },
            { $inc: { balance: transfer.amount } },
          );
        }
    }

    return {};
  }
}
