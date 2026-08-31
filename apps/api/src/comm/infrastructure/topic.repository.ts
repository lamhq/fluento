import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TopicEntity } from '../core/topic.entity';
import { TopicQuery, TopicRepositoryPort } from '../core/topic-repository.port';
import { Topic, TopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicRepository implements TopicRepositoryPort {
  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {}

  async findAll(query: TopicQuery): Promise<TopicEntity[]> {
    const topics = await this.topicModel
      .find({ userId: query.userId })
      .sort({ name: 1 })
      .exec();

    return topics.map((topic) => this.dbModelToEntity(topic));
  }

  private dbModelToEntity(data: TopicDocument): TopicEntity {
    return {
      id: data._id.toString(),
      userId: data.userId,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
