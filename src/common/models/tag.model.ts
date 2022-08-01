import mongoose from "mongoose";

export interface ITag {
  name: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tag: mongoose.Model<ITag> = mongoose.model<ITag>("Tag", schema);
