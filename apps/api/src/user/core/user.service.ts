import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

import type { UserEntity } from './user.entity';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from './user-repository.port';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.cacheManager.get<UserEntity | null>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ email });

    if (user) {
      await this.cacheManager.set(cacheKey, user);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOneByEmail(email);
  }
}
