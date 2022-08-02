import mongoose from "mongoose";
import {
  TransactionDetail,
  ITransactionDetail,
} from "./../../common/models/transactiondetail.model";

export default class TransactionDetailService {
  public async getAllTransDetails() {
    try {
      const transDetails = await TransactionDetail.find();
      return transDetails;
    } catch (err) {
      throw err;
    }
  }
  public async getTransDetail(id: string) {
    try {
      const transDetail = await TransactionDetail.findOne({ _id: id });
      return transDetail;
    } catch (err) {
      throw err;
    }
  }
  public async createTransDetail(body: object) {
    try {
      const transDetail = await TransactionDetail.create(body);
      return transDetail;
    } catch (err) {
      throw err;
    }
  }
}
