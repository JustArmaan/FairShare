import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import path from "path";
import type { UserSchema } from "../interface/types";
import { getUser } from "../routes/authRouter";
import { checkHTMX } from "../utils/checkHTMX";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserSchema;
    isHTMX?: boolean;
  }
}

export const configureApp = async (app: Express) => {
  app.use(express.static(path.resolve(process.cwd(), "public")));

  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use("/", getUser, (req, res, next) => {
    next();
  });

  app.use(checkHTMX);
};
