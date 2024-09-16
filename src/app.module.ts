import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { FormModule } from './form/form.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    SubmissionModule,
    UserModule,
    AuthModule,
    PaymentModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
