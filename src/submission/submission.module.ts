import { forwardRef, Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { SubmissionWebService } from './web/submission-web.service';
import { SubmissionWebController } from './web/submission-web.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schema/submission.schema';
import { FormModule } from 'src/form/form.module';
import { PaymentModule } from 'src/payment/payment.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    FormModule,
    forwardRef(() => PaymentModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [SubmissionController, SubmissionWebController],
  providers: [SubmissionService, SubmissionWebService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
