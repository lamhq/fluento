import type { Repository } from '../../common/data/repository.js';
import { TopicEntity, TopicVisibility } from './topic.entity.js';

export const TOPIC_REPOSITORY = Symbol('TopicRepository');

export interface TopicQuery {
  userId?: string;
  visibility?: TopicVisibility;
}

export type TopicRepository = Repository<TopicEntity, TopicQuery>;
