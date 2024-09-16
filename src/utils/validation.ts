import { UnprocessableEntityException } from '@nestjs/common';
import Ajv from 'ajv';
const ajv = new Ajv();

export const compileSchema = (schema: any) => {
  return ajv.compile(schema);
};

export const validate = (validateFunction, data) => {
  if (!validateFunction(data)) {
    throw new UnprocessableEntityException({ errors: validateFunction.errors });
  }
};
