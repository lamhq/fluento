import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
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
