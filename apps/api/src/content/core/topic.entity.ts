import type { Entity } from '../../common/types/entity';

export class TopicEntity implements Entity {
  id: string;
  name: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<TopicEntity>) {
    Object.assign(this, data);
  }
}
