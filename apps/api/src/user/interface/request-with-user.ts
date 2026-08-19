import { Request } from 'express';

import type { UserEntity } from '../core/user.entity';

export type RequestWithUser = Request & {
  user?: UserEntity;
};
