import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { RequestWithUser } from './request-with-user';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }
    return user;
  },
);
