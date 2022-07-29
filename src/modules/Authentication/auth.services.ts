import User, { IUser } from "../../common/models/user.model";
import {
  IRegister,
  ILogin,
  IResetPassword,
  IReponse,
  IUpdatePassword,
} from "./auth.interface";
import Token from "../../utils/token";
import AppError from "../../utils/appError";
import { ErrorResponsesCode } from "../../utils/constants";
import UserService from "../User/user.services";
import Email from "../../utils/email";

export default class AuthService {
  private token: Token = new Token();
  private email: Email = new Email();
  private userService: UserService = new UserService(User);

  public async register(data: IRegister): Promise<IReponse> {
    const user = await this.userService.createUser(data);
    const tokens = this.token.generateAuthTokens(user);
    return { user, tokens };
  }

  public async login(data: ILogin): Promise<IReponse> {
    const { email, password } = data;
    const user = await this.userService.getUser({ email });
    if (!user || !(await user.correctPassword(password))) {
      throw new AppError(
        ErrorResponsesCode.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    if (!user.isEmailVerified) {
      throw new AppError(
        ErrorResponsesCode.UNAUTHORIZED,
        "Please verify your email"
      );
    }
    const tokens = this.token.generateAuthTokens(user);
    return { user, tokens };
  }

  async logout(refreshToken: string) {
    if (!refreshToken)
      throw new AppError(ErrorResponsesCode.BAD_REQUEST, "Logout Failed");
  }

  async refreshAuth(refreshToken: string) {
    if (!refreshToken)
      throw new AppError(ErrorResponsesCode.BAD_REQUEST, "Please login now!");
    try {
      const payload = await this.token.verifyToken(refreshToken);
      const user: IUser = await this.userService.getUser({ _id: payload.sub });
      const tokens = this.token.generateAuthTokens(user);
      return { tokens };
    } catch (error) {
      throw new AppError(ErrorResponsesCode.FORBIDDEN, "Please authenticate");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const resetPasswordToken = await this.token.generateResetPasswordToken(
        email
      );
      await this.email.sendResetPasswordEmail(email, resetPasswordToken);
    } catch (error) {
      throw new AppError(
        ErrorResponsesCode.INTERNAL_SERVER_ERROR,
        "There was an error sending the email. Try again later!"
      );
    }
  }

  async resetPassword(token: string, data: IResetPassword): Promise<void> {
    try {
      const { password, passwordConfirm } = data;
      const decoded = await this.token.verifyToken(token);
      const user: IUser = await this.userService.getUser({ _id: decoded.sub });

      if (!user) throw new Error();
      user.password = password;
      user.passwordConfirm = passwordConfirm;
      await user.save();
    } catch (error) {
      throw new AppError(
        ErrorResponsesCode.BAD_REQUEST,
        "Password reset failed"
      );
    }
  }
  async verifyEmail(verifyEmailToken: string): Promise<void> {
    try {
      const decoded = await this.token.verifyToken(verifyEmailToken);
      await this.userService.updateUser(
        { _id: decoded.sub },
        { isEmailVerified: true }
      );
    } catch (error) {
      throw new AppError(
        ErrorResponsesCode.UNAUTHORIZED,
        "Email verification failed"
      );
    }
  }

  async sendVerificationEmail(user: IUser): Promise<void> {
    if (!user) {
      throw new AppError(ErrorResponsesCode.BAD_REQUEST, "User does not exist");
    }
    const verifyEmailToken = this.token.generateVerifyEmailToken(user);
    await this.email.sendVerificationEmail(user.email, verifyEmailToken);
  }

  async updatePassword(user: IUser, data: IUpdatePassword) {
    user = await this.userService.getUser({ _id: user._id });
    const { passwordCurrent, password, passwordConfirm } = data;
    if (!(await user.correctPassword(passwordCurrent))) {
      throw new AppError(
        ErrorResponsesCode.UNAUTHORIZED,
        "Your current password is wrong."
      );
    }
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    return await user.save();
  }
}
