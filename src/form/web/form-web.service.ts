import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from '../schema/form.schema';
import { Model, Types } from 'mongoose';
import { Constant } from 'src/utils/constants';

@Injectable()
export class FormWebService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async getForm(urlPath: string) {
    const form = await this.formModel.findOne({ urlPath });
    return { form, platformFee: Constant.PLATFORM_FEE };
  }
}
