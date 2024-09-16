import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from './schema/form.schema';
import { Model, Types } from 'mongoose';
import { CreateFormDto } from './form.dto';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async createForm(userId: Types.ObjectId, createFormDto: CreateFormDto) {
    return await this.formModel.create({
      userId,
      urlPath: Date.now().toString(),
      ...createFormDto,
    });
  }

  async updateForm(
    userId: Types.ObjectId,
    formId: Types.ObjectId,
    updatedData: any,
  ) {
    return await this.formModel.updateOne({ userId, _id: formId }, updatedData);
  }

  async getForm(userId: Types.ObjectId, formId: Types.ObjectId) {
    return await this.formModel.findOne({ _id: formId, userId });
  }

  async getFormById(formId: Types.ObjectId) {
    return await this.formModel.findOne({ _id: formId });
  }

  async updateFormOnSubmission(formId: Types.ObjectId, amount: number) {
    return await this.formModel.findOneAndUpdate(
      { _id: formId, isDeleted: { $in: [true, false] } },
      {
        $inc: { submissionCount: 1, amountCollected: amount },
      },
    );
  }

  async getAllForms(userId: Types.ObjectId) {
    return await this.formModel.find({ userId });
  }

  async deleteForm(userId: Types.ObjectId, formId: Types.ObjectId) {
    return await this.formModel.updateOne(
      { userId, _id: formId },
      { isDeleted: true },
    );
  }
}
