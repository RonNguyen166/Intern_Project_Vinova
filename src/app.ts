import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import CombineRoute from "./modules/index";

dotenv.config({ path: "./config.env" });

const app: express.Express = express();

const DB: string | undefined = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.PASSWORD as string
);
mongoose
  .connect(DB as string)
  .then((data) => {
    console.log("Successfully connected to database");
  })
  .catch((err) => console.log("Error connected to database: ", err));

app.use(express.json());

/*
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.headers);
    return next();
  }
);
*/

/*
test console.log middleware
*/

/*
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.query);
    console.log({ ...req.query });
    return next();
  }
);
*/

const combineRoute = new CombineRoute();

app.use("/api/users", combineRoute.userRouter);

app.listen(process.env.PORT || 6000, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
