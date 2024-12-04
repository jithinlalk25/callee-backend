import { compileSchema } from 'src/utils/validation';

export const submitVf = compileSchema({
  type: 'object',
  properties: {
    formId: { type: 'string' },
    formVersion: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        fields: { type: 'object' },
        quantity: { type: 'number' },
        amount: { type: 'number' },
      },
    },
    // whatsAppNumber: { type: 'string' },
  },
  required: ['formId', 'data', 'formVersion', 'whatsAppNumber'],
});
