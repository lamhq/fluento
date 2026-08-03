import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ValidationException } from '../exceptions/validation.exception';
import { FormError } from '../types/form-error';

/**
 * A pipe that validate and transform the request body using class-validator
 * https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
 */
@Injectable()
export class ValidateRequestBodyPipe extends ValidationPipe {
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

      // transform request body to class instance
      transform: true,

      // transform validation error to exception
      exceptionFactory: (validationErrors) => {
        const errors = this.transformValidationErrors(validationErrors);
        throw new ValidationException(errors);
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
    // only validate request body
    if (metadata.type !== 'body') {
      return value;
    }
    return super.transform(value, metadata);
  }

  /**
   * Convert class-validator errors to application errors
   */
  transformValidationErrors(errors: ValidationError[]): FormError {
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
