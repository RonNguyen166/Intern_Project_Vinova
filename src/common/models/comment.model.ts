import mongoose, { Schema, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IComment extends IBase {
  content: string;
  user_id: mongoose.Schema.Types.ObjectId;
  post_id: mongoose.Schema.Types.ObjectId;
  parent_id: mongoose.Schema.Types.ObjectId[];
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
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    parent_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Comments",
      },
    ],
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

CommentSchema.pre(/^find/, function (next) {
  this.populate("parent_id", "-isDelete -__v");
  this.populate("user_id", "fullName email photo");
  next();
});

export default model<IComment>("Comments", CommentSchema);
