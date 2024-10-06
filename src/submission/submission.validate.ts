import { compileSchema } from 'src/utils/validation';

export const getSubmissionsVf = compileSchema({
  type: 'object',
  properties: {
    formId: { type: 'string' },
    page: { type: 'number' },
    all: { type: 'boolean' },
  },
  required: ['formId', 'page'],
});
