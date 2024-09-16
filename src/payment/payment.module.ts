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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CashfreeOrder.name, schema: CashfreeOrderSchema },
      { name: CashfreeWebhook.name, schema: CashfreeWebhookSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
    forwardRef(() => SubmissionModule),
    forwardRef(() => FormModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
