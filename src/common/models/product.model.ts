import mongoose from "mongoose";
export interface IProduct {
  title: string;
  description: string;
  quantity: number;
  price: number;
  images: string[];
  user_id: mongoose.Schema.Types.ObjectId;
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
    images: {
      type: [String],
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
