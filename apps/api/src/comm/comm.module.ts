import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ExerciseController } from './exercise.controller';
import { ExerciseMapper } from './exercise.mapper';
import { ExerciseRepository } from './exercise.repository';
import { ExerciseService } from './exercise.service';
import { EXERCISE_REPOSITORY_PORT } from './exercise-repository.port';

@Module({
  imports: [PrismaModule],
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    ExerciseMapper,
    ExerciseRepository,
    {
      provide: EXERCISE_REPOSITORY_PORT,
      useExisting: ExerciseRepository,
    },
  ],
})
export class CommModule {}
