export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_EXPIRES_IN: string;
      JWT_SECRET: string;
      JWT_COOKIE_EXPIRES_IN: number;
    }
  }
}
