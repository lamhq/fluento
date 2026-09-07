import type { Repository } from '../../common/types/repository';
import { TopicEntity } from './topic.entity';

export const TOPIC_REPOSITORY = Symbol('TopicRepository');

export interface TopicQuery {
  userId?: string;
}

export type TopicRepository = Repository<TopicEntity, TopicQuery>;
