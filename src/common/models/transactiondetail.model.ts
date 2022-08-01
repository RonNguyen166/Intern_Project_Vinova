import mongoose from "mongoose";

export interface ITransactionDetail {
  transaction_id: mongoose.Schema.Types.ObjectId;
  user_id_to: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<ITransactionDetail>(
  {
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    user_id_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const TransactionDetail: mongoose.Model<ITransactionDetail> =
  mongoose.model<ITransactionDetail>("TransactionDetail", schema);
