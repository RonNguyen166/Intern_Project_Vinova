import { CookieOptions, Request, Response } from "express";
import moment, { Moment } from "moment";

import { successReponse } from "../../common/services/response.sevice";
import catchAsync from "../../utils/catchAsync";
import { ILogin, IRegister, IResetPassword } from "./auth.interface";
import AuthService from "./auth.services";

export default class AuthController {
  public authService: AuthService = new AuthService();

  public register = catchAsync(async (req: Request, res: Response) => {
    const data: IRegister = req.body;
    const result = await this.authService.register(data);
    return successReponse(req, res, result, "Register Successfully", 201);
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const data: ILogin = req.body;
    const result = await this.authService.login(data);
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      expires: moment()
        .add(process.env.JWT_COOKIE_EXPIRATION_DAYS, "days")
        .toDate(),
    });
    return successReponse(req, res, result, "Login Successfully");
  });
  public logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return successReponse(req, res, undefined, "Logout Successfully");
  });
  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body.email);
    return successReponse(req, res, undefined, "Token sent to email!");
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const data: IResetPassword = req.body;
    await this.authService.resetPassword((<any>req).query.token, data);
    return successReponse(req, res, undefined, "Updated Password Successfully");
  });

  public sendVerificationEmail = catchAsync(
    async (req: Request, res: Response) => {
      await this.authService.sendVerificationEmail(
        (<any>req).authenticatedUser
      );
      return successReponse(req, res, undefined, "Token sent to email!");
    }
  );

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    await this.authService.verifyEmail((<any>req).query.token);
    return successReponse(
      req,
      res,
      undefined,
      "Email verification Successfully"
    );
  });

  public refreshToken = catchAsync(async (req: Request, res: Response) => {
    const tokens = await this.authService.refreshAuth(
      (<any>req).cookies.refreshToken
    );
    return successReponse(req, res, tokens, "Refresh Tokens Successfully");
  });
}
