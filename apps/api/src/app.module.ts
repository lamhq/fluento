import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommModule } from './comm/comm.module';
import { configFactory } from './config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFactory],
    }),
    PrismaModule,
    CommModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
