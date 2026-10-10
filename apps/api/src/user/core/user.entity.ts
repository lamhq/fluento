import type { Entity } from '../../common/data/entity.js';

export class UserEntity implements Entity {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}
