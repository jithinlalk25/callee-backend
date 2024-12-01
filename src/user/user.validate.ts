import { compileSchema } from 'src/utils/validation';

export const updateExpoPushTokenVf = compileSchema({
  type: 'object',
  properties: {
    expoPushToken: { type: 'string' },
  },
  required: ['expoPushToken'],
});

export const sendEmailOtpVf = compileSchema({
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
  },
  required: ['email'],
});

export const verifyEmailOtpVf = compileSchema({
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    otp: { type: 'string', pattern: '^[0-9]+$', minLength: 6, maxLength: 6 },
  },
  required: ['email', 'otp'],
});

export const addNameVf = compileSchema({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  required: ['name'],
});
