import express, { type Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { env } from '../../../env';
import { GrantType } from '@kinde-oss/kinde-typescript-sdk';
import { setupKinde } from '@kinde-oss/kinde-node-express';

export const configureApp = (app: Express) => {
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('~/public'));

  const kindeConfig = {
    clientId: env.kindeClientId as string,
    secret: env.kindeSecret as string,
    issuerBaseUrl: 'https://idsp1expensetracker.kinde.com',
    siteUrl: env.baseUrl as string,
    redirectUrl: 'http://localhost:3000/callback',
    scope: 'openid profile email',
    grantType: GrantType.AUTHORIZATION_CODE,
    unAuthorisedUrl: 'http://localhost:3000/login',
    postLogoutRedirectUrl: 'http://localhost:3000',
  };

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

  setupKinde(kindeConfig, app);
};
