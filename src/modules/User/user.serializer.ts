import { Roles } from "../../utils/constants";
import { IPoint } from "../../common/models/point.model";

export interface IResponseUser {
  _id: string;
  fullName: string;
  subName: string;
  alias: string;
  team: string;
  email: string;
  password?: string;
  gender: boolean;
  dob: Date;
  country: string;
  photo: string;
  point: IPoint;
  role: Roles;
  isEmailVerified: boolean;
  isAdmin: boolean;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}
export interface IResultUser {
  _id: string;
  fullName: string;
  subName: string;
  alias: string;
  team: string;
  email: string;
  gender: boolean;
  dob: Date;
  country: string;
  photo: string;
  photoUrl: string;
  givePoint: number;
  redeemPoint: number;
  role: Roles;
  isEmailVerified: boolean;
  isAdmin: boolean;
}

export function serializerUser(model: any): IResponseUser {
  return {
    _id: model._id,
    fullName: model.fullName,
    subName: model.subName,
    alias: model.alias,
    team: model.team,
    email: model.email,
    password: model.password,
    gender: model.gender,
    dob: model.dob,
    country: model.country,
    photo: model.photo,
    point: model.point,

    role: model.role,
    isEmailVerified: model.isEmailVerified,
    isAdmin: model.isAdmin,
    created_by: model.created_by,
    updated_by: model.updated_by,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}

export function serializerGetUser(model: any): IResultUser {
  return {
    _id: model._id,
    fullName: model.fullName,
    subName: model.subName,
    alias: model.alias,
    team: model.team,
    email: model.email,
    gender: model.gender,
    dob: model.dob,
    country: model.country,
    photo: model.photo,
    photoUrl: model.photoUrl,
    givePoint: model.point?.givePoint,
    redeemPoint: model.point?.redeemPoint,
    role: model.role,
    isEmailVerified: model.isEmailVerified,
    isAdmin: model.isAdmin,
  };
}
