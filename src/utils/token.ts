import jwt from "jsonwebtoken";
import moment from "moment";
import User, { IUser } from "../common/models/user.model";
import { ITokens } from "../modules/Authentication/auth.interface";
import UserService from "../modules/User/user.services";
import AppError from "./appError";
import { ErrorResponsesCode } from "./constants";

export interface IToken extends Object {
  sub: string | undefined;
  iat: number;
  exp: number;
}

export default class Token {
  private userService: UserService = new UserService(User);

  public generateToken(
    user: IUser,
    exp: moment.Moment,
    secret = process.env.JWT_SECRET!
  ): string {
    const payload: IToken = {
      sub: user._id,
      iat: moment().unix(),
      exp: exp.unix(),
    };
    return jwt.sign(payload, secret);
  }

  public async verifyToken(token: string): Promise<IToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
        if (err) return reject(err);
        resolve(payload as IToken);
      });
    });
  }

  public generateAuthTokens(user: IUser): ITokens {
    const accessTokenExp = moment().add(
      process.env.JWT_ACCESS_EXPIRATION_MINUTES,
      "minutes"
    );
    const accessToken = this.generateToken(user, accessTokenExp);

    const refreshTokenExp = moment().add(
      process.env.JWT_REFRESH_EXPIRATION_DAYS,
      "days"
    );
    const refreshToken = this.generateToken(user, refreshTokenExp);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userService.getUser({ email });
    if (!user)
      throw new AppError(
        ErrorResponsesCode.NOT_FOUND,
        "No users found with this email"
      );
    const expires = moment().add(
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      "minutes"
    );
    const resetPasswordToken = this.generateToken(user, expires);
    return resetPasswordToken;
  }

  public generateVerifyEmailToken(user: IUser): string {
    const expries = moment().add(
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
      "minutes"
    );
    const verifyEmailToken = this.generateToken(user, expries);
    return verifyEmailToken;
  }
}
