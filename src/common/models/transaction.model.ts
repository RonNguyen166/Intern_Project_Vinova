import mongoose from "mongoose";

export interface ITransaction {
  user: mongoose.Types.ObjectId;
  type: string;
  tag?: [mongoose.Types.ObjectId];
  subject: string;
  point: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<ITransaction>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    type: {
      type: String,
      values: ["Give Pt", "Receive Pt", "Redemption"],
      required: [true, "A transaction must have a type"],
    },
    tag: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    subject: {
      type: String,
      required: [true, "A transaction must have a subject"],
    },
    point: {
      type: Number,
      required: [true, "A transaction must have a point"],
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction: mongoose.Model<ITransaction> =
  mongoose.model<ITransaction>("Transaction", schema);
