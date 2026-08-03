import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseEntity } from '../core/exercise.entity';
import { ExerciseRepositoryPort } from '../core/exercise-repository.port';

@Injectable()
export class ExerciseRepository implements ExerciseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ExerciseEntity): Promise<ExerciseEntity> {
    const createdExercise = await this.prisma.exercise.create({
      data,
    });

    return this.dbModelToEntity(createdExercise);
  }

  async findAll(): Promise<ExerciseEntity[]> {
    const exercises = await this.prisma.exercise.findMany();
    return exercises.map((exercise) => this.dbModelToEntity(exercise));
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    return exercise ? this.dbModelToEntity(exercise) : null;
  }

  async update(
    id: string,
    data: Partial<ExerciseEntity>,
  ): Promise<ExerciseEntity> {
    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data,
    });

    return this.dbModelToEntity(updatedExercise);
  }

  async delete(id: string): Promise<ExerciseEntity> {
    const deletedExercise = await this.prisma.exercise.delete({
      where: { id },
    });

    return this.dbModelToEntity(deletedExercise);
  }

  private dbModelToEntity(data: {
    id: string;
    topics: string[];
    scenario: string;
    learnerRole: string;
    counterpartRole: string;
    prompts: string[];
    expectedResponses: { content: string; style: string[] }[];
    createdAt: Date;
    updatedAt: Date;
  }): ExerciseEntity {
    return {
      id: data.id,
      topics: data.topics,
      scenario: data.scenario,
      learnerRole: data.learnerRole,
      counterpartRole: data.counterpartRole,
      prompts: data.prompts,
      expectedResponses: data.expectedResponses,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
