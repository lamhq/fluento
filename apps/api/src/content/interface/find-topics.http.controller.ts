import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../common/auth/require-user.guard';
import { ApiVersion } from '../../common/http/api-version';
import { TopicService } from '../core/topic.service';
import { TopicDto } from './topic.dto';

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
