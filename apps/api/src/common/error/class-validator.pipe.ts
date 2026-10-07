import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ErrorDetails } from './error-response';
import { RequestValidationException } from './request-validation.exception';

/**
 * NestJS pipe that validates and transforms incoming request using class-validator
 * It returns an exception if the validation fails.
 * https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
 */
@Injectable()
export class ClassValidorPipe extends ValidationPipe {
  constructor() {
    super({
      // required properties cannot be omitted from the request body
      skipMissingProperties: false,

      // properties that don't have validation decorators will be removed from the transformed result
      whitelist: true,

      // throw an error if object contain unknown properties
      forbidNonWhitelisted: true,

      // return validation errors to caller
      disableErrorMessages: false,

      // transform plain JavaScript objects to class object
      transform: true,

      // transform class-validator errors to exception
      exceptionFactory: (validationErrors) => {
        const errors = this.transformValidationErrors(validationErrors);
        return new RequestValidationException(errors);
      },
    });
  }

  /**
   * Validate and transform the input data to class object
   * @param value The incoming request object data.
   * @param metadata Metadata about the request object data (e.g. parameter type).
   * @returns The transformed and validated data.
   * @throws A validation error if the input data fails validation.
   */
  public async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    // skip validation if value is not a plain object
    if (typeof value !== 'object' || !value) {
      return value;
    }
    try {
      return await super.transform(value, metadata);
    } catch (exception) {
      if (exception instanceof RequestValidationException) {
        exception.type = metadata.type;
      }
      throw exception;
    }
  }

  /**
   * Convert class-validator errors to ErrorDetails
   */
  private transformValidationErrors(errors: ValidationError[]): ErrorDetails {
    return errors.reduce((previousValue, currentValue) => {
      if (currentValue.constraints) {
        return {
          ...previousValue,
          [currentValue.property]: Object.values(currentValue.constraints)[0],
        };
      }
      return {
        ...previousValue,
        [currentValue.property]: currentValue.children
          ? currentValue.children.map((item) =>
              this.transformValidationErrors(item.children ?? []),
            )
          : undefined,
      };
    }, {});
  }
}
