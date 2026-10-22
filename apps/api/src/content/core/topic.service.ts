import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { toTitleCase } from '../../common/utils.js';
import {
  CONTEXT_SERVICE,
  type ContextService,
} from '../../context/context.service.js';
import {
  EXERCISE_TOPICS_CHANGED_EVENT,
  type ExerciseTopicsChangedEvent,
} from './exercise-topics-changed.event.js';
import { TopicEntity } from './topic.entity.js';
import { TopicVisibility } from './topic.entity.js';
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
    // fetch user-owned and public topics
    const userId = this.contextService.getUserIdOrThrow();
    const [userTopics, publicTopics] = await Promise.all([
      this.repository.findAll({ userId }),
      this.repository.findAll({ visibility: TopicVisibility.Public }),
    ]);

    // remove duplicated topics by name
    const topics = new Map<string, TopicEntity>();
    for (const topic of [...userTopics, ...publicTopics]) {
      const topicName = topic.name;
      if (!topics.has(topicName)) {
        topics.set(topicName, topic);
      }
    }

    // sort topics by name (case-insensitively)
    return [...topics.values()].sort((left, right) =>
      left.name.localeCompare(right.name, 'en', { sensitivity: 'base' }),
    );
  }

  @OnEvent(EXERCISE_TOPICS_CHANGED_EVENT, { suppressErrors: false })
  async createTopicsFromExercise({
    userId,
    topics,
  }: ExerciseTopicsChangedEvent): Promise<void> {
    // get all available topic names
    const [userTopics, publicTopics] = await Promise.all([
      this.repository.findAll({ userId }),
      this.repository.findAll({ visibility: TopicVisibility.Public }),
    ]);
    const existingNames = new Set(
      [...userTopics, ...publicTopics].map(({ name }) => toTitleCase(name)),
    );

    // create new topics for any names that don't already exist
    for (const name of topics) {
      const normalizedName = toTitleCase(name);
      if (existingNames.has(normalizedName)) continue;

      await this.repository.create({
        name: normalizedName,
        userId,
        visibility: TopicVisibility.Private,
      });

      existingNames.add(normalizedName);
    }
  }
}
