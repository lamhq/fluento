import type { UserEntity } from './user.entity';

export type UserQuery = Partial<Pick<UserEntity, 'email'>>;

export const USER_REPOSITORY_PORT = Symbol('UserRepositoryPort');

export interface UserRepositoryPort {
  findOne(query: UserQuery): Promise<UserEntity | null>;
}
