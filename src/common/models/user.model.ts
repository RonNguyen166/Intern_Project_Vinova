import mongoose from "mongoose";
import bcrypt from "bcrypt";
import express from "express";
export interface IUser {
  name: string;
  email: string;
  password: string;
  correctPassword: Function;
  isModified: Function;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Schema.Types.ObjectId;
}

const schema: mongoose.Schema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty"],
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
  },
  { timestamps: true }
);

schema.pre<IUser>("save", async function (next: any) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  return next();
});

schema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User: mongoose.Model<IUser> = mongoose.model<IUser>(
  "User",
  schema
);
