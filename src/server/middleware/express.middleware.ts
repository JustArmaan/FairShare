import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import type { UserSchema } from "../interface/types";
import { getUser } from "../routes/authRouter";
import { setupVopayTransactionWebhook } from "../integrations/vopay/transfer";
import { checkHTMX } from "../utils/checkHTMX";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserSchema;
    isHTMX?: boolean;
  }
}

interface ErrorWithStatus extends Error {
  status?: number;
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

  await setupVopayTransactionWebhook();

  app.use(
    (
      error: ErrorWithStatus,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(`Error status: ${error.status}`);
      console.error(error, "error caught in the global error handler");

      if (error.status === 404) {
        return res.status(404).send("404 - Not Found");
      }

      error.status = error.status || 500;
      res.status(error.status);
      res.send(`${error.status} - Server Error`);
    }
  );
};
