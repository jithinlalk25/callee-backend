import { Controller, Get, Param } from '@nestjs/common';
import { FormWebService } from './form-web.service';
import { Types } from 'mongoose';

@Controller('form-web')
export class FormWebController {
  constructor(private formWebService: FormWebService) {}

  @Get('getForm/:urlPath')
  async getForm(@Param('urlPath') urlPath: string) {
    return await this.formWebService.getForm(urlPath);
  }
}
