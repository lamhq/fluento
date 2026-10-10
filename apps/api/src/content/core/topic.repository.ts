import type { Repository } from '../../common/data/repository.js';
import { TopicEntity } from './topic.entity.js';

export const TOPIC_REPOSITORY = Symbol('TopicRepository');

export interface TopicQuery {
  userId?: string;
}

export type TopicRepository = Repository<TopicEntity, TopicQuery>;
