import { compileSchema } from 'src/utils/validation';

export const updateExpoPushTokenVf = compileSchema({
  type: 'object',
  properties: {
    expoPushToken: { type: 'string' },
  },
  required: ['expoPushToken'],
});
