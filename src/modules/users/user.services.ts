import express from "express";
import { User, IUser } from "./../../common/models/user.model";
import UserSerializer from "./user.serializer";
export default class UserService {
  userSerializer: UserSerializer = new UserSerializer();

  async getAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (err) {
      throw err;
    }
  }

  async getUser(id: string) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async createUser(body: object) {
    try {
      const user = await User.create(body);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findOneUser(body: object) {
    try {
      const user = await User.findOne(body);
      return user;
    } catch (err) {
      throw err;
    }
  }
}
