import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { User } from 'src/user/schema/user.schema';
import {
  CreateFormDto,
  DeleteFormDto,
  GetFormDto,
  UpdateFormDto,
} from './form.dto';
import { validate } from 'src/utils/validation';
import {
  createFormVf,
  deleteFormVf,
  getFormVf,
  updateFormVf,
} from './form.validate';
import { LoginGuard } from 'src/auth/guard/login/login.guard';
import { Types } from 'mongoose';

@UseGuards(LoginGuard)
@Controller('form')
export class FormController {
  constructor(private formService: FormService) {}

  @Post('createForm')
  async createForm(
    @Request() { user }: { user: User },
    @Body() createFormDto: CreateFormDto,
  ) {
    validate(createFormVf, createFormDto);
    return await this.formService.createForm(user._id, createFormDto);
  }

  @Post('updateForm')
  async updateForm(
    @Request() { user }: { user: User },
    @Body() updateFormDto: UpdateFormDto,
  ) {
    validate(updateFormVf, updateFormDto);
    const { formId, ...updatedData } = updateFormDto;
    return await this.formService.updateForm(
      user._id,
      new Types.ObjectId(formId),
      updatedData,
    );
  }

  @Post('getForm')
  async getForm(
    @Request() { user }: { user: User },
    @Body() getFormDto: GetFormDto,
  ) {
    validate(getFormVf, getFormDto);
    return await this.formService.getForm(
      user._id,
      new Types.ObjectId(getFormDto.formId),
    );
  }

  @Post('deleteForm')
  async deleteForm(
    @Request() { user }: { user: User },
    @Body() deleteFormDto: DeleteFormDto,
  ) {
    validate(deleteFormVf, deleteFormDto);
    return await this.formService.deleteForm(
      user._id,
      new Types.ObjectId(deleteFormDto.formId),
    );
  }

  @Get('getAllForms')
  async getAllForms(@Request() { user }: { user: User }) {
    return await this.formService.getAllForms(user._id);
  }
}
