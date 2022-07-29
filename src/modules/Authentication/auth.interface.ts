export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
export interface IResetPassword {
  password: string;
  passwordConfirm: string;
}

export interface IReponse {
  user: object;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface IUpdatePassword {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}
