import {
  AmountTypeEnum,
  FeeCollectedFromEnum,
  FormStatusEnum,
} from './schema/form.schema';

export class CreateFormDto {
  title: string;
  description: string;
  fields: any[];
  expiry: string;
  status: FormStatusEnum;
  amountType: AmountTypeEnum;
  quantityField: any;
  amount: number;
  feeCollectedFrom: FeeCollectedFromEnum;
}

export class UpdateFormDto {
  formId: string;
  title: string;
  description: string;
  fields: any[];
  expiry: string;
  status: FormStatusEnum;
  amountType: AmountTypeEnum;
  quantityField: any;
  amount: number;
  feeCollectedFrom: FeeCollectedFromEnum;
}

export class GetFormDto {
  formId: string;
}

export class DeleteFormDto {
  formId: string;
}
