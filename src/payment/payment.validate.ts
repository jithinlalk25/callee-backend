import { compileSchema } from 'src/utils/validation';
import { TransactionFilterEnum } from './payment.service';
import { AccountTypeEnum } from './schema/wallet.schema';

export const getTransactionsVf = compileSchema({
  type: 'object',
  properties: {
    page: { type: 'number' },
    filter: { type: 'string', enum: Object.values(TransactionFilterEnum) },
  },
  required: ['page', 'filter'],
});

export const addAccountVf = compileSchema({
  type: 'object',
  properties: {
    type: { type: 'string', enum: Object.values(AccountTypeEnum) },
    bankAccountNumber: { type: 'string' },
    bankIfsc: { type: 'string' },
    vpa: { type: 'string' },
  },
  required: ['type'],
});
