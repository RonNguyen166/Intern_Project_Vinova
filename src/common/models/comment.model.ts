import mongoose from "mongoose";

export interface IComment {
  content: string;
  user_id: mongoose.Schema.Types.ObjectId;
  parent_id: mongoose.Schema.Types.ObjectId;
  type: string;
  onModel: string;
}

const schema = new mongoose.Schema<IComment>({
  content: {
    type: "String",
    required: [true, "A comment cannot be empty"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "onMOdel",
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Comment, Post"],
  },
});

export const Comment: mongoose.Model<IComment> = mongoose.model<IComment>(
  "Comment",
  schema
);
