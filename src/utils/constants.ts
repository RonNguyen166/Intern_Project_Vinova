export enum StatusCode {
  Active = "active",
  Deactive = "deactive",
}

export enum TXNTypes {
  Redemption = "Redeemption",
  Give = "Give Pt",
  Receive = "Receive Pt",
  Convert = "Convert Pt",
}

export enum Roles {
  Admin = "admin",
  Menber = "member",
  ViceLead = "vice lead",
  Leader = "leader",
}

export enum ErrorMessages {
  NOT_FOUND = "Not Found",
  UNAUTHORIZED = "Unauthorized",
  PERMISSION_DENIED = "Permission Denied",
  BAD_REQUEST = "Bad Request",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

export enum ErrorResponsesCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
