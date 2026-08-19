export class UserEntity {
  id: string;
  email: string;

  constructor(data?: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}
