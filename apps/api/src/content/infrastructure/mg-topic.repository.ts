import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { TopicEntity } from '../core/topic.entity.js';
import { TopicQuery, TopicRepository } from '../core/topic.repository.js';
import { TopicDocument, TopicModel } from './topic.schema.js';

@Injectable()
export class MgTopicRepository implements TopicRepository {
  constructor(
    @InjectModel(TopicModel.name)
    private readonly topicModel: Model<TopicModel>,
  ) {}

  async findAll(query?: TopicQuery): Promise<TopicEntity[]> {
    const filter: FilterQuery<TopicModel> = {};

    if (query?.userId) {
      filter.userId = new Types.ObjectId(query.userId);
    }

    if (query?.visibility) {
      filter.visibility = query.visibility;
    }

    const topics = await this.topicModel
      .find(filter)
      .collation({ locale: 'en', strength: 2 })
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

  async create(
    data: Omit<TopicEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TopicEntity> {
    const createdTopic = await this.topicModel.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
    });

    return this.dbModelToEntity(createdTopic);
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
      userId: data.userId.toString(),
      name: data.name,
      visibility: data.visibility,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
