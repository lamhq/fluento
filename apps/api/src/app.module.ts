import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommModule } from './comm/comm.module';
import { CONTEXT_SERVICE } from './common/core/context.service';
import { NodeContextService } from './common/infrastructure/node-context.service';
import { configFactory } from './config';
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
    UserModule,
    CommModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NodeContextService,
    {
      provide: CONTEXT_SERVICE,
      useExisting: NodeContextService,
    },
  ],
})
export class AppModule {}
