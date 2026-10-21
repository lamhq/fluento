import { Inject, Injectable } from '@nestjs/common';

import {
  CONTEXT_SERVICE,
  type ContextService,
} from '../../context/context.service.js';
import { TopicEntity } from './topic.entity.js';
import { TOPIC_REPOSITORY, type TopicRepository } from './topic.repository.js';

@Injectable()
export class TopicService {
  constructor(
    @Inject(TOPIC_REPOSITORY)
    private readonly repository: TopicRepository,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  async findAll(): Promise<TopicEntity[]> {
    return this.repository.findAll({
      userId: this.contextService.getUserIdOrThrow(),
    });
  }
}
