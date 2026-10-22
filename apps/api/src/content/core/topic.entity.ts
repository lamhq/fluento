import type { Entity } from '../../common/data/entity.js';

export enum TopicVisibility {
  Private = 'private',
  Public = 'public',
}

export class TopicEntity implements Entity {
  id: string;
  name: string;
  userId: string;
  visibility: TopicVisibility;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<TopicEntity>) {
    Object.assign(this, data);
  }
}
