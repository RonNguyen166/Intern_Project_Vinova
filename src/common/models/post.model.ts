import { number } from "joi";
import mongoose from "mongoose";

export interface IPost {
  user_id: mongoose.Schema.Types.ObjectId;
  images: string[];
  title: string;
  body: string;
  category: mongoose.Schema.Types.ObjectId;
  tag: mongoose.Schema.Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<IPost>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: [String],
    title: String,
    body: { type: String, required: [true, "A post must have content"] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tag: [{ type: mongoose.Schema.Types.ObjectId }],
    views: Number,
  },
  { timestamps: true }
);

export const Post: mongoose.Model<IPost> = mongoose.model<IPost>(
  "Post",
  schema
);
