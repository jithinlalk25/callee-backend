import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from '../schema/form.schema';
import { Model } from 'mongoose';
import { Constant } from 'src/utils/constants';
import { hasFormExpired } from 'src/utils/utils';

@Injectable()
export class FormWebService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async getForm(urlPath: string) {
    const form = await this.formModel.findOne({ urlPath });
    if (form.expiry && hasFormExpired(form.expiry)) {
      throw new Error('Form expired');
    }
    return { form, platformFee: Constant.PLATFORM_FEE };
  }
}
