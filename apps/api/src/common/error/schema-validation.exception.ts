import {
  BadRequestException,
  StandardSchemaValidationPipeOptions,
} from '@nestjs/common';

export type SchemaValidationIssues = Parameters<
  NonNullable<StandardSchemaValidationPipeOptions['exceptionFactory']>
>[0];

export class SchemaValidationException extends BadRequestException {
  source: 'body' | 'query' = 'body';

  constructor(readonly issues: SchemaValidationIssues) {
    super('Request validation failed');
  }
}
