import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './core/user.service';
import { USER_REPOSITORY } from './core/user-repository.port';
import { User, UserSchema } from './infrastructure/schemas/user.schema';
import { UserRepository } from './infrastructure/user.repository';
import { UserMiddleware } from './interface/user.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    UserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: UserRepository,
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
