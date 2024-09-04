import { Body, Controller, Post } from '@nestjs/common';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post('getAllSubmission')
  async getAllSubmission(@Body() data: any) {
    return await this.submissionService.getAllSubmission(data.form);
  }

  @Post('addSubmission')
  async addSubmission(@Body() data: any) {
    return await this.submissionService.addSubmission(data);
  }
}
