import { TopicEntity } from './topic.entity';

export const TOPIC_REPOSITORY = Symbol('TopicRepository');

export interface TopicQuery {
  userId: string;
}

export interface TopicRepositoryPort {
  findAll(query: TopicQuery): Promise<TopicEntity[]>;
}
