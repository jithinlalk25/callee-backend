import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import {
  CashfreeOrder,
  CashfreeOrderSchema,
} from './schema/cashfreeOrder.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionModule } from 'src/submission/submission.module';
import {
  CashfreeWebhook,
  CashfreeWebhookSchema,
} from './schema/cashfreeWebhook.schema';
import { FormModule } from 'src/form/form.module';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentWebService } from './web/payment-web.service';
import { PaymentWebController } from './web/payment-web.controller';
import { Transfer, TransferSchema } from './schema/transfer.schema';
import { PaymentWebhookController } from './webhook/webhook.controller';
import { PaymentWebhookService } from './webhook/webhook.service';
import {
  PayoutWebhook,
  PayoutWebhookSchema,
} from './schema/payoutWebhook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CashfreeOrder.name, schema: CashfreeOrderSchema },
      { name: CashfreeWebhook.name, schema: CashfreeWebhookSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Transfer.name, schema: TransferSchema },
      { name: PayoutWebhook.name, schema: PayoutWebhookSchema },
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
