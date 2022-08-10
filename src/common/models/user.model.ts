import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { Roles } from "../../utils/constants";
import { SchemaBase, IBase } from "./base.model";
import pointModel, { IPoint } from "./point.model";
export interface IUser extends IBase {
  fullName: string;
  subName: string;
  alias: string;
  team: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: boolean;
  dob: Date;
  country: string;
  photo: string;
  role: Roles;
  point: IPoint;
  isAdmin: boolean;
  correctPassword: Function;
  isEmailTaken: Function;
  isAliasTaken: Function;
}

const UserSchema: Schema = new Schema<IUser>(
  SchemaBase({
    fullName: {
      type: String,
      required: true,
    },
    subName: String,
    alias: String,
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    team: String,
    password: {
      type: String,
      required: true,
    },
    passwordConfirm: {
      type: String,
      required: true,
    },
    gender: Boolean,
    country: String,
    photo: {
      type: String,
      default:
        "https://intern-nodejs-vinova.s3.ap-southeast-1.amazonaws.com/uploads/default.png",
    },
    role: {
      type: String,
      enum: Roles,
      default: Roles.Member,
    },
    point: pointModel.schema,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  }),
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

UserSchema.index({
  fullName: "text",
  alias: "text",
  email: "text",
  role: 1,
  team: 1,
});

UserSchema.pre<IUser>("save", async function (next: any): Promise<void> {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = "";
  return next();
});

UserSchema.pre<IUser>("save", async function (next: any): Promise<void> {
  if (!this.isModified("role")) return next();
  this.isAdmin = this.role === "admin";
  return next();
});

UserSchema.statics.isAliasTaken = async function (alias: string) {
  const user = await this.findOne({ alias });
  return !!user;
};

UserSchema.methods.correctPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.statics.isEmailTaken = async function (email: string) {
  const user = await this.findOne({ email });
  return !!user;
};

export default model<IUser>("Users", UserSchema);
