import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseRepositoryPort } from './exercise-repository.port';

@Injectable()
export class ExerciseRepository implements ExerciseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ExerciseEntity): Promise<ExerciseEntity> {
    const createdExercise = await this.prisma.exercise.create({
      data: this.toCreateInput(data),
    });

    return this.toEntity(createdExercise);
  }

  async findAll(): Promise<ExerciseEntity[]> {
    const exercises = await this.prisma.exercise.findMany();
    return exercises.map((exercise) => this.toEntity(exercise));
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    return exercise ? this.toEntity(exercise) : null;
  }

  async update(
    id: string,
    data: Partial<ExerciseEntity>,
  ): Promise<ExerciseEntity> {
    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data: this.toUpdateInput(data),
    });

    return this.toEntity(updatedExercise);
  }

  async delete(id: string): Promise<ExerciseEntity> {
    const deletedExercise = await this.prisma.exercise.delete({
      where: { id },
    });

    return this.toEntity(deletedExercise);
  }

  private toCreateInput(data: ExerciseEntity): Prisma.ExerciseCreateInput {
    return {
      name: data.name,
      sentences: data.sentences,
      prompts: data.prompts,
      topics: data.topics,
    };
  }

  private toUpdateInput(
    data: Partial<ExerciseEntity>,
  ): Prisma.ExerciseUpdateInput {
    return {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.sentences !== undefined ? { sentences: data.sentences } : {}),
      ...(data.prompts !== undefined ? { prompts: data.prompts } : {}),
      ...(data.topics !== undefined ? { topics: data.topics } : {}),
    };
  }

  private toEntity(data: {
    id: string;
    name: string;
    sentences: { content: string; style: string; meaning?: string | null }[];
    prompts: { content: string; style: string; meaning?: string | null }[];
    topics: string[];
    createdAt: Date;
    updatedAt: Date;
  }): ExerciseEntity {
    return {
      id: data.id,
      name: data.name,
      sentences: data.sentences,
      prompts: data.prompts,
      topics: data.topics,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
