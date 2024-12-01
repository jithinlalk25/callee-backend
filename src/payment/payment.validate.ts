import { compileSchema } from 'src/utils/validation';

export const getTransactionsVf = compileSchema({
  type: 'object',
  properties: {
    page: { type: 'number' },
  },
  required: ['page'],
});

export const saveAddressVf = compileSchema({
  type: 'object',
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    postalCode: { type: 'string' },
  },
  required: ['street1', 'street2', 'city', 'state', 'postalCode'],
});

export const saveBankAccountVf = compileSchema({
  type: 'object',
  properties: {
    accountNumber: { type: 'string' },
    ifsc: { type: 'string' },
  },
  required: ['accountNumber', 'ifsc'],
});
