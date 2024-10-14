import { compileSchema } from 'src/utils/validation';
import {
  AmountTypeEnum,
  FeeCollectedFromEnum,
  FormStatusEnum,
} from './schema/form.schema';

export const createFormVf = compileSchema({
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    expiry: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    status: { type: 'string', enum: Object.values(FormStatusEnum) },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      },
    },
    amountType: { type: 'string', enum: Object.values(AmountTypeEnum) },
    quantityField: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
    amount: { type: 'number', minimum: 1 },
    feeCollectedFrom: {
      type: 'string',
      enum: Object.values(FeeCollectedFromEnum),
    },
  },
  required: [
    'title',
    'fields',
    'amountType',
    'expiry',
    'status',
    'feeCollectedFrom',
  ],
  allOf: [
    {
      if: {
        properties: {
          amountType: { const: AmountTypeEnum.FIXED },
        },
      },
      then: {
        required: ['amount'],
      },
    },
    {
      if: {
        properties: {
          amountType: { const: AmountTypeEnum.QUANTITY },
        },
      },
      then: {
        required: ['amount', 'quantityField'],
      },
    },
  ],
});

export const updateFormVf = compileSchema({
  type: 'object',
  properties: {
    formId: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    expiry: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    status: { type: 'string', enum: Object.values(FormStatusEnum) },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      },
    },
    amountType: { type: 'string', enum: Object.values(AmountTypeEnum) },
    quantityField: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
    amount: { type: 'number', minimum: 1 },
    feeCollectedFrom: {
      type: 'string',
      enum: Object.values(FeeCollectedFromEnum),
    },
  },
  required: [
    'formId',
    'title',
    'fields',
    'amountType',
    'expiry',
    'status',
    'feeCollectedFrom',
  ],
  allOf: [
    {
      if: {
        properties: {
          amountType: { const: AmountTypeEnum.FIXED },
        },
      },
      then: {
        required: ['amount'],
      },
    },
    {
      if: {
        properties: {
          amountType: { const: AmountTypeEnum.QUANTITY },
        },
      },
      then: {
        required: ['amount', 'quantityField'],
      },
    },
  ],
});

export const getFormVf = compileSchema({
  type: 'object',
  properties: {
    formId: { type: 'string' },
  },
  required: ['formId'],
});

export const deleteFormVf = compileSchema({
  type: 'object',
  properties: {
    formId: { type: 'string' },
  },
  required: ['formId'],
});
