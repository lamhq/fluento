import type { Entity, EntityId } from './entity';

// CRUD interface for generic entities
export interface Repository<TEntity extends Entity, TQuery extends object> {
  // Get entity by ID
  findById(id: EntityId): Promise<TEntity | null>;

  // Get all entities
  findAll(query?: TQuery): Promise<TEntity[]>;

  // Get all entities with pagination
  findAllPaginated(query?: TQuery): Promise<[number, TEntity[]]>;

  // Create a new entity
  create(
    entity: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TEntity>;

  // Update entity by ID
  update(
    id: EntityId,
    updates: Partial<Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TEntity>;

  // Delete entity by ID
  delete(id: EntityId): Promise<void>;
}
