import jsonwebtoken from "jsonwebtoken";

declare global {
  namespace jsonwebtoken {
    interface JwtPayload {
      id: string;
    }
  }
}
