export interface IWrite<T> {
  create(data: object): Promise<T | object>;
  update(filter: object, data: object): Promise<T | object>;
  delete(filter: object): Promise<T | object>;
}

export interface IRead<T> {
  getAll(): Promise<T[] | object[]>;
  getOne(filter: object): Promise<T | object>;
}
