import type { UserEntity } from './user.entity';

export type UserQuery = Partial<Pick<UserEntity, 'email'>>;

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserRepositoryPort {
  findOne(query: UserQuery): Promise<UserEntity | null>;
}
