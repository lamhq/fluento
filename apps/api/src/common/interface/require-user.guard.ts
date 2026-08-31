import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CONTEXT_SERVICE, type ContextService } from '../core/context.service';

@Injectable()
export class RequireUser implements CanActivate {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  canActivate(_context: ExecutionContext): boolean {
    const userId = this.contextService.getUserId();

    if (!userId) {
      throw new UnauthorizedException('User not found in context');
    }

    return true;
  }
}
