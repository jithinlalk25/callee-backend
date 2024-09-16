import { TransactionFilterEnum } from './payment.service';

export class GetTransactionsDto {
  page: number;
  filter: TransactionFilterEnum;
}
