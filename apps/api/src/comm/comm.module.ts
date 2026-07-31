import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { CommController } from './comm.controller';
import { CommService } from './comm.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommController],
  providers: [CommService],
})
export class CommModule {}
