import mongoose from "mongoose";
import { isTemplateLiteralTypeNode } from "typescript";
import {
  Transaction,
  ITransaction,
} from "../../common/models/transaction.model";

export default class TransactionService {
  public async getAllTransactions() {
    try {
      const transactions = await Transaction.find()
        .populate("user_id", "-password -createdAt -updatedAt -__v")
        .populate("tag", "-createdAt -updatedAt -__v");
      return transactions;
    } catch (err) {
      throw err;
    }
  }
  public async getTransaction(id: string) {
    try {
      const transaction = await Transaction.findById(id)
        .populate("user_id", "-password -createdAt -updatedAt -__v")
        .populate("tag", "-createdAt -updatedAt -__v");

      return transaction;
    } catch (err) {
      throw err;
    }
  }
  public async createTransaction(body: object) {
    try {
      const transaction = await Transaction.create(body);
      return transaction;
    } catch (err) {
      throw err;
    }
  }
  public async getTransactionByUserId(userid: string) {
    try {
      const transaction = await Transaction.find({ user_id: userid })
        .populate("user_id", "-password -createdAt -updatedAt -__v")
        .populate("tag", "-createdAt -updatedAt -__v");
      return transaction;
    } catch (err) {
      throw err;
    }
  }
  public async getTopReceivers() {
    try {
      console.log("getTopReceivers");
      const topReceivers = await Transaction.aggregate([
        {
          $match: {
            type: "Receive Pt",
          },
        },
        {
          $group: {
            _id: "$user_id",
            count: { $sum: "$point" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);
      return topReceivers;
    } catch (err) {
      throw err;
    }
  }
  public async getTopGivers() {
    try {
      const topGivers: any = await Transaction.aggregate([
        {
          $match: {
            type: "Give Pt",
          },
        },
        {
          $group: {
            _id: "$user_id",
            count: { $sum: "$point" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);
      for (let i = 0; i < topGivers.length; i++) {
        topGivers[i].count = -topGivers[i].count;
        //topGivers[i].user.password = null;
      }
      return topGivers;
    } catch (err) {
      throw err;
    }
  }
}
