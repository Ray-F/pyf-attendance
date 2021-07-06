interface IRepository<T> {

  list(): Promise<T[]>;

  getById(id: string): Promise<T>;

  save(item: T): Promise<T>;

}


export {
  IRepository
}
