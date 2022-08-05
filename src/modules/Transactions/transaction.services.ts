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
        .populate("user", "alias name")
        .populate("tag", "-createdAt -updatedAt -__v");
      return transactions;
    } catch (err) {
      throw err;
    }
  }
  public async getTransaction(id: string) {
    try {
      const transaction = await Transaction.findById(id)
        .populate("user", "alias name")
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
      const transaction = await Transaction.find({ user: userid })
        .populate("user", "alias name")
        .populate("tag", "-createdAt -updatedAt -__v");
      return transaction;
    } catch (err) {
      throw err;
    }
  }
  public async getTopReceivers() {
    try {
      //console.log("getTopReceivers");
      const topReceivers = await Transaction.aggregate([
        {
          $match: {
            type: "Receive Pt",
          },
        },
        {
          $group: {
            _id: "$user",
            pointreceive: { $sum: "$point" },
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
                  fullName: 1,
                  alias: 1,
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
            _id: "$user",
            pointgive: { $sum: "$point" },
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
                  fullName: 1,
                  alias: 1,
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
        topGivers[i].pointgive = -topGivers[i].pointgive;
        //topGivers[i].user.password = null;
      }
      return topGivers;
    } catch (err) {
      throw err;
    }
  }
}
