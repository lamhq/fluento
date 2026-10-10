import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';

import { RequireUser } from '../../common/auth/require-user.guard.js';
import { ApiVersion } from '../../common/http/api-version.js';
import { TopicService } from '../core/topic.service.js';
import { TopicDto } from './topic.dto.js';

@Controller({ path: 'practice/topics', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindTopicsHttpController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<TopicDto[]> {
    const topics = await this.topicService.findAll();
    return topics.map((topic) => TopicDto.fromEntity(topic));
  }
}
