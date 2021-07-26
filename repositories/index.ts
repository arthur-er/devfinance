export default interface Repository<T = any> {
  all(): T[];
  find(id: string): T | undefined;
  create(data: T): boolean;
  update(id: string, data: T): boolean;
  delete(id: string): boolean;
}
