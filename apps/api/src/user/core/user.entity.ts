import type { Entity } from '../../common/types/entity';

export class UserEntity implements Entity {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}
