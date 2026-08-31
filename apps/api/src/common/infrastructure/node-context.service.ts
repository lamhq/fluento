import { Global, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { ContextService } from '../core/context.service';

@Global()
@Injectable()
export class NodeContextService implements ContextService {
  constructor(private readonly cls: ClsService) {}

  getUserId(): string | undefined {
    return this.cls.get<string>('userId');
  }

  getUserIdOrThrow(): string {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User context not found');
    }
    return userId;
  }
}
