import { compileSchema } from 'src/utils/validation';

export const sendOtpVf = compileSchema({
  type: 'object',
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]+$',
      minLength: 10,
      maxLength: 10,
    },
  },
  required: ['phoneNumber'],
});

export const verifyOtpVf = compileSchema({
  type: 'object',
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]+$',
      minLength: 10,
      maxLength: 10,
    },
    otp: { type: 'string', pattern: '^[0-9]+$', minLength: 6, maxLength: 6 },
  },
  required: ['phoneNumber', 'otp'],
});
