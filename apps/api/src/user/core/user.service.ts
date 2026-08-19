import { Inject, Injectable } from '@nestjs/common';

import type { UserEntity } from './user.entity';
import {
  USER_REPOSITORY_PORT,
  type UserQuery,
  type UserRepositoryPort,
} from './user-repository.port';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async findOne(query: UserQuery): Promise<UserEntity | null> {
    return this.userRepository.findOne(query);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ email });
  }
}
