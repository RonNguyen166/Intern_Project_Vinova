import {
  Transaction,
  ITransaction,
} from "../../common/models/transaction.model";
import AppError from "./../../utils/appError";
import { ErrorMessages, ErrorResponsesCode } from "../../utils/constants";

export default class TransactionService {
  public async getAllTransactions(): Promise<ITransaction[]> {
    try {
      const transactions = await Transaction.find()
        .populate("user", "alias name")
        .populate("tag", "-createdAt -updatedAt -__v")
        .populate("category", "name")
        .populate("favorites", "fullName email photo")
        .populate({
          path: "comments",
          select: "-isDelete -__v",
          options: { sort: { created_at: 1 } },
        });
      if (!transactions) {
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          "Transactions not found"
        );
      }
      return transactions;
    } catch (err) {
      throw err;
    }
  }
  public async getTransaction(id: string): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findById(id)
        .populate("user", "alias name")
        .populate("tag", "-createdAt -updatedAt -__v")
        .populate("category", "name")
        .populate("favorites", "fullName email photo")
        .populate({
          path: "comments",
          select: "-isDelete -__v",
          options: { sort: { created_at: 1 } },
        });

      if (!transaction) {
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          "Transaction not found"
        );
      }
      return transaction;
    } catch (err) {
      throw err;
    }
  }
  public async createTransaction(body: object): Promise<ITransaction> {
    try {
      const transaction = await Transaction.create(body);
      if (!transaction) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          "Cannot create transaction"
        );
      }
      return transaction;
    } catch (err) {
      throw err;
    }
  }
  public async getTransactionByUserId(userid: string): Promise<ITransaction[]> {
    try {
      const transactions = await Transaction.find({ user: userid })
        .populate("user", "alias name")
        .populate("tag", "-createdAt -updatedAt -__v")
        .populate("category", "name")
        .populate("favorites", "fullName email photo")
        .populate({
          path: "comments",
          select: "-isDelete -__v",
          options: { sort: { created_at: 1 } },
        });
      if (!transactions) {
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          "Transactions not found"
        );
      }
      return transactions;
    } catch (err) {
      throw err;
    }
  }
  public async getTopReceivers() {
    try {
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

  public async getTransactionsTypeGive() {
    try {
      const transactions = await Transaction.find({
        type: "Give Pt",
      });
      return transactions;
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

  public async updateTransaction(
    transaction_id: string,
    body: object
  ): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findOneAndUpdate(
        { _id: transaction_id },
        body
      );
      if (!transaction) {
        throw new AppError(ErrorResponsesCode.BAD_REQUEST, "Update error");
      }
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  public async toFavorite(transactionId: string, user: any): Promise<any> {
    try {
      if (!user) {
        throw new AppError(ErrorResponsesCode.BAD_REQUEST, "Please login");
      }
      const transaction = await this.getTransaction(transactionId);
      if (!transaction)
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Post not found");

      const check = transaction.favorites.findIndex((userId: any) =>
        userId.equals(user._id)
      );
      if (check != -1) {
        transaction.favorites.splice(check, 1);
      } else {
        transaction.favorites.push(user._id);
      }
      await this.updateTransaction(transactionId, transaction);
    } catch (err) {
      throw err;
    }
  }

  public async toView(transactionId: string): Promise<any> {
    try {
      const transaction = await this.getTransaction(transactionId);
      if (!transaction) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Post not found");
      }
      await transaction.toView();
    } catch (err) {
      throw err;
    }
  }
}
