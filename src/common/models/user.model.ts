import mongoose from "mongoose";
import bcrypt from "bcrypt";
interface IUser {
  name: String;
  email: String;
  password: String;
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
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
  },
  { timestamps: true }
);

schema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.hash_password);
};

export const User: mongoose.Model<IUser> = mongoose.model<IUser>(
  "User",
  schema
);
