import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { UserService } from '../core/user.service';
import type { RequestWithUser } from '../interface/request-with-user';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: RequestWithUser, _res: Response, next: NextFunction) {
    const email = req.headers['x-user-email'];

    if (typeof email === 'string' && email) {
      const user = await this.userService.findOne({ email });
      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
