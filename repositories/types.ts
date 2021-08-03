type DeletedModel<T> = T & { deleted: boolean };

export default interface Repository<T> {
  all(): Promise<T[]>;
  find(id: number): Promise<T | null>;
  findBy<Key extends keyof T>(key: Key, value: T[Key]): Promise<T | null>;
  create(data: T): Promise<T>;
  update(id: number, data: T): Promise<T>;
  delete(id: number): Promise<DeletedModel<T>>;
}
