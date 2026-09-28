import { TopicEntity } from '../core/topic.entity';

export class TopicDto {
  id: string;
  name: string;
  createdAt: string;

  constructor(data?: Partial<TopicDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: TopicEntity): TopicDto {
    return new TopicDto({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
    });
  }
}
