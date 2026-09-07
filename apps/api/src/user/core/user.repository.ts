import type { Repository } from '../../common/types/repository';
import type { UserEntity } from './user.entity';

export type UserQuery = Partial<Pick<UserEntity, 'email'>>;

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserRepository extends Repository<UserEntity, UserQuery> {
  findOne(query: UserQuery): Promise<UserEntity | null>;
}
