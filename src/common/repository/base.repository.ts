import { Model } from "mongoose";
import AppError from "../../utils/AppError";
import { IRead, IWrite } from "./inteface.repository";
import { ErrorMessages } from "../../utils/constants";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  private entity: Model<T>;
  constructor(entity: Model<T>) {
    this.entity = entity;
  }
  public async create(data: object): Promise<T | object> {
    try {
      const results = new this.entity(data);
      await results.save();
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async getAll(): Promise<T[] | object[]> {
    try {
      const filter: object = { isDelete: false };
      const results = await this.entity.find(filter).exec();
      if (!results) throw new AppError(404, ErrorMessages.NOT_FOUND);
      return results;
    } catch (error) {
      throw error;
    }
  }
  public async getOne(filter: object): Promise<T | object> {
    try {
      filter = { ...filter, isDelete: false };
      const results = await this.entity.findOne(filter).exec();
      if (!results) throw new AppError(404, ErrorMessages.NOT_FOUND);
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async update(filter: object, data: object): Promise<T | object> {
    try {
      filter = { ...filter, isDelete: false };
      const results = await this.entity
        .findOneAndUpdate(filter, data, { new: true })
        .exec();
      if (!results) throw new AppError(404, ErrorMessages.NOT_FOUND);
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async delete(filter: object): Promise<T | object> {
    try {
      filter = { ...filter, isDelete: false };
      const results = await this.entity
        .findOneAndUpdate(filter, { isDelete: true }, { new: true })
        .exec();
      if (!results) throw new AppError(404, ErrorMessages.NOT_FOUND);
      return results;
    } catch (error) {
      throw error;
    }
  }
}
