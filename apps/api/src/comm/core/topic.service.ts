import { Inject, Injectable } from '@nestjs/common';

import {
  CONTEXT_SERVICE,
  type ContextService,
} from '../../common/core/context.service';
import { TopicEntity } from './topic.entity';
import { TOPIC_REPOSITORY, type TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(
    @Inject(TOPIC_REPOSITORY)
    private readonly repository: TopicRepository,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  async findTopicsForUser(): Promise<TopicEntity[]> {
    return this.repository.findAll({
      userId: this.contextService.getUserIdOrThrow(),
    });
  }
}
