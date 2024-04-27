import express from 'express';
import { type Request, type Response } from 'express';
import session from 'express-session';
import { indexRouter } from './routes/indexRouter';
import bodyParser from 'body-parser';
import {
  setupKinde,
  protectRoute,
  getUser,
  GrantType,
} from '@kinde-oss/kinde-node-express';
import ViteExpress from 'vite-express';

// const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

const kindeConfig = {
  clientId: '', // TODO: setup with env vars
  secret: '',
  issuerBaseUrl: '',
  siteUrl: 'http://localhost:3000',
  redirectUrl: 'http://localhost:3000',
  scope: 'openid profile email',
  grantType: GrantType.AUTHORIZATION_CODE, //or CLIENT_CREDENTIALS or PKCE
  unAuthorisedUrl: 'http://localhost:3000/login',
  postLogoutRedirectUrl: 'http://localhost:3000',
};

// setupKinde(kindeConfig, app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

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

app.use(indexRouter);

/*
app.use((_: Request, res: Response) => {
  res.status(404).send('Page not found');
});

app.use((error: Error, _: Request, res: Response) => {
  console.error(error);
  res.status(500).send('Internal Server Error');
});
*/

ViteExpress.listen(app, PORT as number, () =>
  console.log(`Server is running on port ${PORT}...`)
);
