import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { USER_REPOSITORY } from './core/user.repository.js';
import { UserService } from './core/user.service.js';
import { MgUserRepository } from './infrastructure/mg-user.repository.js';
import { UserModel, UserSchema } from './infrastructure/schemas/user.schema.js';
import { UserMiddleware } from './interface/user.middleware.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    MgUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: MgUserRepository,
    },
    UserMiddleware,
  ],
  exports: [UserMiddleware],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
