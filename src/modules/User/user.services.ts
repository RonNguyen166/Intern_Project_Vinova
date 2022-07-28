import mongoose, { Model } from "mongoose";
import { getTextOfJSDocComment } from "typescript";
import User, { IUser } from "../../common/models/user.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/AppError";
export default class UserService extends BaseRepository<IUser> {
  constructor(public readonly userRepository: Model<IUser>) {
    super(userRepository);
  }
  async getAllUsers(): Promise<any> {
    try {
      const users = await this.getAll();
      if (!users) {
        throw new AppError(404, "User not Exist");
      }
      return users;
    } catch (err) {
      throw err;
    }
  }
  async getFilterUser(filter: any): Promise<any> {
    try {
      let { page, size, alias, search, sortBy, orderBy } = filter;
      let _page = page ? parseInt(page) : 1;
      let _size = size ? parseInt(size) : 10;
      let users, totalRows, finalFilter;
      const _sortBy: string = sortBy ? sortBy : "created_at";
      const _orderBy: number = orderBy ? parseInt(orderBy) : 1;
      const sorting: any = { [_sortBy]: _orderBy };
      if (!alias) {
        if (search) {
          finalFilter = {
            isDelete: false,
            $text: { $search: '"' + search + '"' },
          };
        } else {
          finalFilter = { isDelete: false };
        }
      } else {
        if (search) {
          finalFilter = {
            isDelete: false,
            $text: { $search: '"' + search + '"' },
          };
        } else {
          finalFilter = { isDelete: false, alias: alias };
        }
      }
      users = await User.find(finalFilter)
        .select({ isDelete: 0 })
        .limit(_size)
        .skip(_size * (_page - 1))
        .sort(sorting)
        .exec();
      totalRows = await User.countDocuments(finalFilter).exec();
      if (!users) {
        throw new AppError(404, "User not Exist");
      }
      return {
        data: users,
        totalRows,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId: any): Promise<any> {
    try {
      const user = await this.getOne({ _id: userId });
      if (!user) {
        throw new AppError(404, "User not Exist");
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(data: any): Promise<any> {
    try {
      const user = await this.create(data);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(userId: any, data: object) {
    try {
      const user = await this.update({ _id: userId }, data);
      if (!user) {
        throw new AppError(404, "User not Exist");
      }
      return user;
    } catch (err) {
      throw err;
    }
  }
  async deleteUser(userId: any) {
    try {
      const user = await this.delete({ _id: userId });
      if (!user) {
        throw new AppError(404, "User not Exist");
      }
      return user;
    } catch (err) {
      throw err;
    }
  }
}
