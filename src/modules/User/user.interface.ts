import { IPoint } from "../../common/models/point.model";
import { Roles } from "../../utils/constants";
export interface IUserCreate {
  fullName: string;
  alias: string;
  team: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: boolean;
  dob: Date;
  country: string;
  photo: string;
  point: IPoint;
  role: Roles;
  isEmailVerified: boolean;
}

export interface IUserUpdate {
  fullName?: string;
  alias?: string;
  team?: string;
  email?: string;
  gender?: boolean;
  dob?: Date;
  country?: string;
  photo?: string;
  role?: Roles;
}

export interface IUserProfile {
  fullName?: string;
  subName?: string;
  password?: string;
  passwordConfirm?: string;
  photo?: string;
}
export interface IUserGet {
  page?: string;
  size?: string;
  team?: string;
  role?: string;
  search?: string;
  sortBy?: string;
  orderBy?: string;
}
