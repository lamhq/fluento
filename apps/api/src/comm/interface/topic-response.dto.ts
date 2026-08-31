import { TopicEntity } from '../core/topic.entity';

export class TopicResponseDto {
  id: string;
  name: string;
  createdAt: string;

  constructor(data?: Partial<TopicResponseDto>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: TopicEntity): TopicResponseDto {
    return new TopicResponseDto({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  }
}
