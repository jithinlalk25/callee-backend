import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionModule } from 'src/submission/submission.module';
import { FormModule } from 'src/form/form.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentWebService } from './web/payment-web.service';
import { PaymentWebController } from './web/payment-web.controller';
import { PaymentWebhookController } from './webhook/webhook.controller';
import { PaymentWebhookService } from './webhook/webhook.service';
import {
  RazorpayOrder,
  RazorpayOrderSchema,
} from './schema/razorpayOrder.schema';
import {
  RazorpayWebhook,
  RazorpayWebhookSchema,
} from './schema/razorpayWebhook.schema';
import { Account, AccountSchema } from './schema/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RazorpayOrder.name, schema: RazorpayOrderSchema },
      { name: RazorpayWebhook.name, schema: RazorpayWebhookSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    forwardRef(() => SubmissionModule),
    forwardRef(() => FormModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  providers: [PaymentService, PaymentWebService, PaymentWebhookService],
  controllers: [
    PaymentController,
    PaymentWebController,
    PaymentWebhookController,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
