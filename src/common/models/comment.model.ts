import mongoose, { Schema, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IComment extends IBase {
  content: string;
  user_id: mongoose.Schema.Types.ObjectId;
  parent_id: mongoose.Schema.Types.ObjectId;
  reply: boolean;
  replies: mongoose.Schema.Types.ObjectId[];
}

const CommentSchema = new Schema<IComment>(
  SchemaBase({
    content: {
      type: "String",
      required: [true, "A comment cannot be empty"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reply: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "replies",
    select: "-isDelete -__v",
    options: { sort: { created_at: 1 } },
  });
  this.populate("user_id", "fullName email photo");
  next();
});

export default model<IComment>("Comments", CommentSchema);
