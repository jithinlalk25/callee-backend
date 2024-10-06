import { TransactionFilterEnum } from './payment.service';
import { AccountTypeEnum } from './schema/wallet.schema';

export class GetTransactionsDto {
  page: number;
  filter: TransactionFilterEnum;
}

export class AddAccountDto {
  type: AccountTypeEnum;
  bankAccountNumber: string;
  bankIfsc: string;
  vpa: string;
}
