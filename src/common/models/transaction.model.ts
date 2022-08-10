import { number } from "joi";
import mongoose from "mongoose";

export interface ITransaction {
  _id: string;
  user: mongoose.Types.ObjectId;
  type: string;
  tag: [mongoose.Types.ObjectId];
  subject: string;
  point: number;
  createdAt: Date;
  updatedAt: Date;
  category: mongoose.Types.ObjectId;
  comments: [{ type: mongoose.Schema.Types.ObjectId; ref: "Comments" }];
  favorites: [{ type: mongoose.Schema.Types.ObjectId; ref: "Users" }];
  views: number;
  toView: Function;
}

const schema = new mongoose.Schema<ITransaction>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    type: {
      type: String,
      values: ["Give Pt", "Receive Pt", "Redemption"],
      required: [true, "A transaction must have a type"],
    },
    tag: [{ type: mongoose.Types.ObjectId, ref: "Tags" }],
    subject: {
      type: String,
      required: [true, "A transaction must have a subject"],
    },
    point: {
      type: Number,
      required: [true, "A transaction must have a point"],
    },
    views: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      default: "62eba29fc8e5860fe3f21845",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  },
  {
    timestamps: true,
  }
);

schema.methods.toView = async function (): Promise<Error | number> {
  return ++this.views && this.save();
};

export const Transaction: mongoose.Model<ITransaction> =
  mongoose.model<ITransaction>("Transaction", schema);
