import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiDataResponse(
  status: number,
  type: Type<unknown>,
  isArray = false,
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        required: ['request_id', 'data'],
        properties: {
          request_id: { type: 'string' },
          data: isArray
            ? { type: 'array', items: { $ref: getSchemaPath(type) } }
            : { $ref: getSchemaPath(type) },
        },
      },
    }),
  );
}
