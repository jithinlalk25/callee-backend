import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission, SubmissionStatusEnum } from '../schema/submission.schema';
import { Model, Types } from 'mongoose';
import { FormService } from 'src/form/form.service';
import { AmountTypeEnum } from 'src/form/schema/form.schema';
import { Constant } from 'src/utils/constants';
import { PaymentService } from 'src/payment/payment.service';
import { hasFormExpired } from 'src/utils/utils';

@Injectable()
export class SubmissionWebService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    private formService: FormService,
    private paymentService: PaymentService,
  ) {}

  async submit(formId: Types.ObjectId, formVersion: string, data: any) {
    const form = await this.formService.getFormByQuery({
      _id: formId,
      version: formVersion,
    });

    if (!form) {
      throw new Error('Form not found');
    }

    if (form.expiry && hasFormExpired(form.expiry)) {
      throw new Error('Form expired');
    }

    form.fields.forEach((field) => {
      if (!(field.id in data.fields)) {
        throw new Error('Invalid data');
      }
    });

    let amount: number;

    switch (form.amountType) {
      case AmountTypeEnum.FIXED:
        amount = form.amount;
        break;
      case AmountTypeEnum.QUANTITY:
        if (!('quantity' in data)) {
          throw new Error('Invalid data');
        }
        amount = form.amount * data.quantity;
        break;
      case AmountTypeEnum.CUSTOM:
        if (!('amount' in data)) {
          throw new Error('Invalid data');
        }
        amount = data.amount;
        break;
    }

    const amountWithPlatformFee =
      amount + amount * (Constant.PLATFORM_FEE / 100);

    const order = await this.paymentService.createOrder(amountWithPlatformFee);
    await this.submissionModel.create({
      formId,
      data,
      amount,
      amountWithPlatformFee,
      status: SubmissionStatusEnum.DATA_SUBMITTED,
      orderId: new Types.ObjectId(order.order_id),
    });

    return {
      paymentSessionId: order.payment_session_id,
      returnUrl: order.order_meta.return_url,
    };
  }
}
