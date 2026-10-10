import { ArgumentMetadata, StandardSchemaValidationPipe } from '@nestjs/common';

import { SchemaValidationException } from './schema-validation.exception';

export class SchemaValidationPipe extends StandardSchemaValidationPipe {
  constructor() {
    super({
      exceptionFactory: (issues) => new SchemaValidationException(issues),
    });
  }

  async transform<T = unknown>(
    value: T,
    metadata: ArgumentMetadata,
  ): Promise<T> {
    try {
      return await super.transform(value, metadata);
    } catch (exception) {
      if (exception instanceof SchemaValidationException) {
        exception.source = metadata.type === 'query' ? 'query' : 'body';
        throw exception;
      }

      throw exception;
    }
  }
}
