import express, {
  type NextFunction,
  type Request,
  type Response,
  type Application,
} from "express";
import session from "express-session";
import bodyParser from "body-parser";

export const configureApp = (app: Application) => {
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static("../../../public"));
  
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

};
