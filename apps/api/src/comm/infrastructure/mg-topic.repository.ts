import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TopicEntity } from '../core/topic.entity';
import { TopicQuery, TopicRepository } from '../core/topic.repository';
import { Topic, TopicDocument } from './schemas/topic.schema';

@Injectable()
export class MgTopicRepository implements TopicRepository {
  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {}

  async findAll(query?: TopicQuery): Promise<TopicEntity[]> {
    const topics = await this.topicModel
      .find(query?.userId === undefined ? {} : { userId: query.userId })
      .sort({ name: 1 })
      .exec();

    return topics.map((topic) => this.dbModelToEntity(topic));
  }

  findById(): Promise<TopicEntity | null> {
    throw new Error('Method not implemented.');
  }

  findAllPaginated(): Promise<[number, TopicEntity[]]> {
    throw new Error('Method not implemented.');
  }

  create(): Promise<TopicEntity> {
    throw new Error('Method not implemented.');
  }

  update(): Promise<TopicEntity> {
    throw new Error('Method not implemented.');
  }

  delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private dbModelToEntity(data: TopicDocument): TopicEntity {
    return {
      id: data._id.toString(),
      userId: data.userId?.toString(),
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
