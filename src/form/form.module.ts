import { forwardRef, Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './schema/form.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { FormWebController } from './web/form-web.controller';
import { FormWebService } from './web/form-web.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  providers: [FormService, FormWebService],
  controllers: [FormController, FormWebController],
  exports: [FormService],
})
export class FormModule {}
