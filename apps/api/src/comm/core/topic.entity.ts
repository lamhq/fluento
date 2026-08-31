export class TopicEntity {
  id: string;
  userId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<TopicEntity>) {
    Object.assign(this, data);
  }
}
