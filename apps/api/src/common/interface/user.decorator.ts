import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { AppRequest } from './app-request';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AppRequest>();
    const { userId } = request;

    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return userId;
  },
);
