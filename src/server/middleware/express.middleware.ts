import express, { type Express } from 'express';
import session from 'express-session';
import type { UserSchema } from '../interface/types';
import { getUser } from '../routes/authRouters';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserSchema;
  }
}

export const configureApp = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static('~/public'));

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use('/', getUser, (_, __, next) => {
    next();
  });
};
