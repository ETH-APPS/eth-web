import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

const constraintCodes: Record<string, string> = {
  equals: 'MISMATCH',
  isEmail: 'INVALID_FORMAT',
  isEnum: 'ENUM_VALUE',
  isInt: 'INVALID_TYPE',
  isNumber: 'INVALID_TYPE',
  isPositive: 'MIN_VALUE',
  isString: 'INVALID_TYPE',
  matches: 'INVALID_FORMAT',
  maxLength: 'MAX_LENGTH',
  minLength: 'MIN_LENGTH',
  whitelistValidation: 'UNKNOWN_FIELD',
};

export function fieldValidationException(fields: Record<string, string[]>) {
  return new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: 'Payload Validation Failed',
    fields,
  });
}

export function validationException(errors: ValidationError[]) {
  const fields: Record<string, string[]> = {};
  for (const error of errors) {
    const codes =
      error.value === undefined || error.value === null || error.value === ''
        ? ['REQUIRED']
        : Object.keys(error.constraints ?? {}).map(
            (constraint) => constraintCodes[constraint] ?? 'INVALID_VALUE',
          );
    fields[error.property] = [...new Set(codes)];
  }
  return fieldValidationException(fields);
}
