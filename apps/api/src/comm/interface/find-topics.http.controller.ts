import { Controller, Get, UseGuards } from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { TopicService } from '../core/topic.service';
import { TopicResponseDto } from './topic-response.dto';

@Controller({ path: 'practice/topics', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindTopicsHttpController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async findTopicsForUser(): Promise<TopicResponseDto[]> {
    const topics = await this.topicService.findTopicsForUser();
    return topics.map((topic) => TopicResponseDto.fromEntity(topic));
  }
}
