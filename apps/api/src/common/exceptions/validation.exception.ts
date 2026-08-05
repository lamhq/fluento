import { BadRequestException } from '@nestjs/common';

import { FormError } from '../types/form-error';

export class ValidationException extends BadRequestException {
  constructor(public readonly errors: FormError) {
    super('Validation failed');
  }
}
