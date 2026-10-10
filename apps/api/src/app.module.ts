import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { configFactory } from './config.js';
import { ContentModule } from './content/content.module.js';
import { ContextModule } from './context/context.module.js';
import { ManageModule } from './manage/manage.module.js';
import { PracticeModule } from './practice/practice.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFactory],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('database.url'),
      }),
      inject: [ConfigService],
    }),
    ContextModule,
    UserModule,
    ContentModule,
    PracticeModule,
    ManageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
