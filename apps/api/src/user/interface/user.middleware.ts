import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';

import { USER_EMAIL_HEADER } from '../../common/constants';
import { UserService } from '../core/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly cls: ClsService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const email = req.headers[USER_EMAIL_HEADER];

    if (typeof email === 'string' && email) {
      const user = await this.userService.findOneByEmail(email);
      if (user) {
        this.cls.set('userId', user.id);
      }
    }

    next();
  }
}
