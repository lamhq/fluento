import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommService {
  constructor(private readonly prisma: PrismaService) {}

  async runExerciseCrudDemo(): Promise<void> {
    console.log('[CommDemo] Starting Exercise CRUD demo');

    // create
    const createdExercise = await this.prisma.exercise.create({
      data: {
        name: 'Demo Exercise',
        topics: ['demo', 'crud'],
        sentences: [{ content: 'This is a demo sentence.', style: 'neutral' }],
        prompts: [{ content: 'Create a demo prompt.', style: 'neutral' }],
      },
    });
    console.log('[CommDemo] Created exercise', createdExercise.id);

    // find one
    const fetchedExercise = await this.prisma.exercise.findUnique({
      where: { id: createdExercise.id },
    });
    console.log('[CommDemo] Read exercise', fetchedExercise);

    // update
    const updatedExercise = await this.prisma.exercise.update({
      where: { id: createdExercise.id },
      data: {
        name: 'Demo Exercise Updated',
      },
    });
    console.log('[CommDemo] Updated exercise', updatedExercise.id);

    // delete
    await this.prisma.exercise.delete({
      where: { id: createdExercise.id },
    });
    console.log('[CommDemo] Deleted exercise', createdExercise.id);
  }
}
