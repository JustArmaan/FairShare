import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import type { UserSchema } from "../interface/types";
import { getUser } from "../routes/authRouter";
import { checkHTMX } from "../utils/checkHTMX";
import morgan from "morgan";
import { env } from "../../../env";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserSchema;
    isHTMX?: boolean;
  }
}

export const configureApp = async (app: Express) => {
  env.isDev && app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("~/public"));
  app.use(cookieParser());

  app.use("/", getUser, (_, __, next) => {
    next();
  });

  app.use(checkHTMX);
};
