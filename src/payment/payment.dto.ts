export class GetTransactionsDto {
  page: number;
}

export class SaveAddressDto {
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
}

export class SaveBankAccountDto {
  accountNumber: string;
  ifsc: string;
}
