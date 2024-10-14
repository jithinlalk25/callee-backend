import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from './schema/form.schema';
import { Model, Types } from 'mongoose';
import { CreateFormDto } from './form.dto';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  // Generate a random string of 4 characters (uppercase and lowercase)
  private generateUrlPath(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let urlPath = '';
    for (let i = 0; i < 4; i++) {
      urlPath += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return urlPath;
  }

  // Check if the urlPath already exists in the database
  private async isUrlPathUnique(urlPath: string): Promise<boolean> {
    const form = await this.formModel.findOne({ urlPath }).exec();
    return !form; // return true if not found, meaning it's unique
  }

  // Generate a unique urlPath
  public async createUniqueUrlPath(): Promise<string> {
    let urlPath;
    let isUnique = false;

    // Keep generating until we find a unique urlPath
    do {
      urlPath = this.generateUrlPath();
      isUnique = await this.isUrlPathUnique(urlPath);
    } while (!isUnique);

    return urlPath;
  }

  async createForm(userId: Types.ObjectId, createFormDto: CreateFormDto) {
    return await this.formModel.create({
      userId,
      urlPath: await this.createUniqueUrlPath(),
      version: Date.now().toString(),
      ...createFormDto,
    });
  }

  async updateForm(
    userId: Types.ObjectId,
    formId: Types.ObjectId,
    updatedData: any,
  ) {
    const form = (
      await this.formModel.findOne({ _id: formId, userId })
    ).toObject();
    delete form.history;
    delete form._id;
    delete form.userId;
    delete form.urlPath;
    return await this.formModel.updateOne(
      { userId, _id: formId },
      {
        ...updatedData,
        version: Date.now().toString(),
        $push: { history: form },
      },
    );
  }

  async getForm(userId: Types.ObjectId, formId: Types.ObjectId) {
    return await this.formModel
      .findOne({ _id: formId, userId })
      .select('-history');
  }

  async getFormByQuery(query: any) {
    return await this.formModel.findOne(query).select('-history');
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
    return await this.formModel
      .find({ userId })
      .select('-history')
      .sort({ createdAt: -1 });
  }

  async deleteForm(userId: Types.ObjectId, formId: Types.ObjectId) {
    return await this.formModel.updateOne(
      { userId, _id: formId },
      { isDeleted: true },
    );
  }
}
