import { AmountTypeEnum, FormStatusEnum } from './schema/form.schema';

export class CreateFormDto {
  title: string;
  fields: any[];
  expiry: string;
  status: FormStatusEnum;
  amountType: AmountTypeEnum;
  quantityField: any;
  amount: number;
}

export class UpdateFormDto {
  formId: string;
  title: string;
  fields: any[];
  expiry: string;
  status: FormStatusEnum;
  amountType: AmountTypeEnum;
  quantityField: any;
  amount: number;
}

export class GetFormDto {
  formId: string;
}

export class DeleteFormDto {
  formId: string;
}
