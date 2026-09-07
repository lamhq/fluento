import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { UserEntity } from '../core/user.entity';
import { UserQuery, UserRepository } from '../core/user.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class MgUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOne(query: UserQuery): Promise<UserEntity | null> {
    const user = await this.userModel.findOne(query).exec();
    return user ? this.dbModelToEntity(user) : null;
  }

  findById(): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }

  findAllPaginated(): Promise<[number, UserEntity[]]> {
    throw new Error('Method not implemented.');
  }

  create(): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  update(): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private dbModelToEntity(data: UserDocument): UserEntity {
    return {
      id: data._id.toString(),
      email: data.email,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
