import type { Repository } from '../../common/data/repository.js';
import type { UserEntity } from './user.entity.js';

export type UserQuery = Partial<Pick<UserEntity, 'email'>>;

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserRepository extends Repository<UserEntity, UserQuery> {
  findOne(query: UserQuery): Promise<UserEntity | null>;
}
