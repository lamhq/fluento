import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ClsService } from 'nestjs-cls';

import { USER_EMAIL_HEADER } from '../../common/constants';
import type { AppRequest } from '../../common/interface/app-request';
import { UserService } from '../core/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly cls: ClsService,
  ) {}

  async use(req: AppRequest, _res: Response, next: NextFunction) {
    const email = req.headers[USER_EMAIL_HEADER];

    if (typeof email === 'string' && email) {
      const user = await this.userService.findOneByEmail(email);

      if (user) {
        req.userId = user.id;
        this.cls.set('userId', user.id);
      }
    }

    next();
  }
}
