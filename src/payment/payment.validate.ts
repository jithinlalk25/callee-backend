import { compileSchema } from 'src/utils/validation';
import { TransactionFilterEnum } from './payment.service';

export const getTransactionsVf = compileSchema({
  type: 'object',
  properties: {
    page: { type: 'number' },
    filter: { type: 'string', enum: Object.values(TransactionFilterEnum) },
  },
  required: ['page', 'filter'],
});
