import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission, SubmissionStatusEnum } from './schema/submission.schema';
import { Model, Types } from 'mongoose';
import { FormService } from 'src/form/form.service';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    private formService: FormService,
  ) {}

  async updateSubmissionStatus(
    orderId: Types.ObjectId,
    status: SubmissionStatusEnum,
  ) {
    return await this.submissionModel.findOneAndUpdate({ orderId }, { status });
  }

  async getSubmission(orderId: Types.ObjectId, status: SubmissionStatusEnum) {
    return this.submissionModel.findOne({ orderId, status });
  }

  async getSubmissions(
    userId: Types.ObjectId,
    formId: Types.ObjectId,
    page: number = 1,
  ) {
    const form = await this.formService.getForm(userId, formId);
    if (form) {
      const limit = 30;
      return await this.submissionModel
        .find({ formId, status: SubmissionStatusEnum.PAID })
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    }
  }
}
