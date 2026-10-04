import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configFactory } from './config';
import { ContentModule } from './content/content.module';
import { ContextModule } from './context/context.module';
import { ManageModule } from './manage/manage.module';
import { PracticeModule } from './practice/practice.module';
import { UserModule } from './user/user.module';

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
