import { Body, Controller, Post } from '@nestjs/common';
import { SubmissionWebService } from './submission-web.service';
import { SubmitDto } from './submission-web.dto';
import { validate } from 'src/utils/validation';
import { submitVf } from './submission-web.validate';
import { Types } from 'mongoose';

@Controller('submission-web')
export class SubmissionWebController {
  constructor(private submissionWebService: SubmissionWebService) {}

  @Post('submit')
  async submit(@Body() submitDto: SubmitDto) {
    validate(submitVf, submitDto);

    return await this.submissionWebService.submit(
      new Types.ObjectId(submitDto.formId),
      submitDto.formVersion,
      submitDto.data,
    );
  }
}
