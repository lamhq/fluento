import { TopicEntity } from './topic.entity';

export const TOPIC_REPOSITORY = Symbol('TopicRepository');

export interface TopicQuery {
  userId: string;
}

export interface TopicRepository {
  findAll(query: TopicQuery): Promise<TopicEntity[]>;
}
