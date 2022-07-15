import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
app.listen(process.env.PORT || 6000, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
