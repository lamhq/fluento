import { Inject, Injectable } from '@nestjs/common';

import { TopicEntity } from './topic.entity';
import { TOPIC_REPOSITORY, type TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(
    @Inject(TOPIC_REPOSITORY)
    private readonly repository: TopicRepository,
  ) {}

  async findAll(): Promise<TopicEntity[]> {
    return this.repository.findAll();
  }
}
