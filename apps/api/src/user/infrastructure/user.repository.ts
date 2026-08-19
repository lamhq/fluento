import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import type { UserEntity } from '../core/user.entity';
import { UserQuery, UserRepositoryPort } from '../core/user-repository.port';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOne(query: UserQuery): Promise<UserEntity | null> {
    const user = await this.userModel.findOne(query).lean().exec();
    return user ? this.dbModelToEntity(user) : null;
  }

  private dbModelToEntity(data: {
    _id: Types.ObjectId;
    email: string;
  }): UserEntity {
    return {
      id: data._id.toString(),
      email: data.email,
    };
  }
}
