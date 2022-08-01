import express, { Application, NextFunction, Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import CombineRoute from "./modules/index";
import "dotenv/config";
import config from "./config/config";
import { ErrorMessages, ErrorResponsesCode } from "./utils/constants";
import { errorConverter, errorHandler } from "./middlewares/error.middleware";
import AppError from "./utils/appError";

mongoose
  .connect(
    process.env.MONGO_URL!.replace("<PASSWORD>", process.env.PASSWORD!),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(async () => {
    const app: Application = express();
    const port = process.env.PORT || 6000;
    config(app);
    const combineRoute = new CombineRoute();
    combineRoute.start(app);
    console.log("Database connection established");
    app.use("*", function (req: Request, res: Response, next: NextFunction) {
      next(new AppError(ErrorResponsesCode.NOT_FOUND, ErrorMessages.NOT_FOUND));
    }
    );

    app.use(errorConverter);
    app.use(errorHandler);
    app.listen(port, () =>
      console.log(`Server is running on ${port} at http://localhost:${port}`)
    );
  })
  .catch((err) => console.log("Cannot connect to database. Error: ", err));
