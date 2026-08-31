import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { USER_REPOSITORY } from './core/user.repository';
import { UserService } from './core/user.service';
import { MongooseUserRepository } from './infrastructure/mongoose-user.repository';
import { User, UserSchema } from './infrastructure/schemas/user.schema';
import { UserMiddleware } from './interface/user.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    MongooseUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: MongooseUserRepository,
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
