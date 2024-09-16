import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/user/schema/user.schema';
import { SubmissionService } from './submission.service';
import { LoginGuard } from 'src/auth/guard/login/login.guard';
import { GetSubmissionsDto } from './submission.dto';
import { validate } from 'src/utils/validation';
import { getSubmissionsVf } from './submission.validate';
import { Types } from 'mongoose';

@UseGuards(LoginGuard)
@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post('getSubmissions')
  async getSubmissions(
    @Request() { user }: { user: User },
    @Body() getSubmissionsDto: GetSubmissionsDto,
  ) {
    validate(getSubmissionsVf, getSubmissionsDto);
    return await this.submissionService.getSubmissions(
      user._id,
      new Types.ObjectId(getSubmissionsDto.formId),
      getSubmissionsDto.page,
    );
  }
}
