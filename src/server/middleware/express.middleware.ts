import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import type { UserSchema } from "../interface/types";
import { getUser } from "../routes/authRouter";
import { setupVopayTransactionWebhook } from "../integrations/vopay/transfer";
import { checkHTMX } from "../utils/checkHTMX";
import { remapSvgs } from "./svgHandler.middleware";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserSchema;
    isHTMX?: boolean;
  }
}

export const configureApp = async (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("~/public"));
  app.use(cookieParser());

  app.use("/", getUser, (req, res, next) => {
    next();
  });

  app.use(checkHTMX);
  app.use(remapSvgs);

  await setupVopayTransactionWebhook();
};
