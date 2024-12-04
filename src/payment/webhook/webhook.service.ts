import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendPushNotifications } from 'src/utils/notification';
import { SubmissionService } from 'src/submission/submission.service';
import { FormService } from 'src/form/form.service';
import { UserService } from 'src/user/user.service';
import { SubmissionStatusEnum } from 'src/submission/schema/submission.schema';
// import { sendWhatsAppMessageSuccess } from 'src/utils/whatsapp';
import { RazorpayWebhook } from '../schema/razorpayWebhook.schema';
import { RazorpayOrder } from '../schema/razorpayOrder.schema';

@Injectable()
export class PaymentWebhookService {
  constructor(
    @InjectModel(RazorpayWebhook.name)
    private razorpayWebhookModel: Model<RazorpayWebhook>,
    @InjectModel(RazorpayOrder.name)
    private razorpayOrderModel: Model<RazorpayOrder>,
    private submissionService: SubmissionService,
    private formService: FormService,
    private userService: UserService,
  ) {}

  async razorpayOrderWebhook(eventId: string, data: any) {
    const event = await this.razorpayWebhookModel.findOne({ _id: eventId });
    if (!event) {
      await this.razorpayWebhookModel.create({ _id: eventId, data });
      if (data.event == 'order.paid') {
        const order = await this.razorpayOrderModel.findOne({
          razorpayOrderId: data.payload.order.entity.id,
        });
        const submissionExist = await this.submissionService.getSubmission(
          order._id,
          SubmissionStatusEnum.PAID,
        );

        if (!submissionExist) {
          const submission =
            await this.submissionService.updateSubmissionStatus(
              order._id,
              SubmissionStatusEnum.PAID,
            );
          const form = await this.formService.updateFormOnSubmission(
            submission.formId,
            submission.amountForUser,
          );
          const user = await this.userService.getUser(form.userId);
          if (user.expoPushToken) {
            await sendPushNotifications(
              `₹${submission.amountForUser} received for ${form.title}`,
              [user.expoPushToken],
            );
          }
          // await sendWhatsAppMessageSuccess(
          //   submission.whatsAppNumber,
          //   submission.finalAmountCollected,
          //   form.title,
          // );
        }
      }
    }

    return {};
  }
}
