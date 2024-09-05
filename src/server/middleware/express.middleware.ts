import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import type { UserSchema } from "../interface/types";
import { getUser } from "../routes/authRouter";
import { checkHTMX } from "../utils/checkHTMX";
import morgan from "morgan";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserSchema;
    isHTMX?: boolean;
  }
}

export const configureApp = async (app: Express) => {
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("~/public"));
  app.use(cookieParser());

  app.use("/", getUser, (req, res, next) => {
    next();
  });

  app.use(checkHTMX);
};
