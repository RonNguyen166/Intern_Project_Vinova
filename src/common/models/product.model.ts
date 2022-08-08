import mongoose from "mongoose";
import { stringify } from "uuid";
export interface IProduct {
  title: string;
  description: string;
  quantity: number;
  price: number;
  photo: string;
  user: mongoose.Schema.Types.ObjectId;
  branch_id: mongoose.Schema.Types.ObjectId;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema: mongoose.Schema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "A product must have a title"],
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, "A product must have a quantity"],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    photo: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    status: {
      type: mongoose.Schema.Types.Boolean,
      required: [true, "A product must have a status"],
      default: true,
    },
  },
  { timestamps: true }
);

export const Product: mongoose.Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  schema
);
