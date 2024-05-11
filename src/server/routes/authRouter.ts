import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
} from '@kinde-oss/kinde-typescript-sdk';
import { env } from '../../../env';
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { createUser, findUser } from '../services/user.service';
import { seedFakeTransactions } from '../database/seedFakeTransations';

const router = express.Router();

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: env.kindeAuthDomain!,
  clientId: env.kindeClientId!,
  clientSecret: env.kindeSecret!,
  redirectURL: `${env.baseUrl}/auth/callback`,
  logoutRedirectURL: env.baseUrl!,
});

const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
} as const;

const sessionManager = (req: Request, res: Response): SessionManager => ({
  async getSessionItem(key: string) {
    return req.cookies[key];
  },
  async setSessionItem(key: string, value: unknown) {
    if (typeof value === 'string') {
      res.cookie(key, value, cookieOptions);
    } else {
      res.cookie(key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    res.clearCookie(key, cookieOptions);
  },
  async destroySession() {
    ['id_token', 'access_token', 'user', 'refresh_token'].forEach((key) => {
      res.clearCookie(key, cookieOptions);
    });
  },
});

// const sessionManager: SessionManager = {
//   async getSessionItem(key: string) {
//     return store[key];
//   },
//   async setSessionItem(key: string, value: unknown) {
//     console.log(value, 'value here');
//     store[key] = value;
//   },
//   async removeSessionItem(key: string) {
//     delete store[key];
//   },
//   async destroySession() {
//     store = {};
//   },
// };

router.get('/login', async (req, res) => {
  const loginUrl = await kindeClient.login(sessionManager(req, res));
  return res.redirect(loginUrl.toString());
});

router.get('/register', async (_, res) => {
  const registerUrl = await kindeClient.register(sessionManager(req, res));
  return res.redirect(registerUrl.toString());
});

router.get('/callback', async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get('host')}${req.url}`);
  await kindeClient.handleRedirectToApp(sessionManager(req, res), url);
  return res.redirect('/');
});

router.get('/logout', async (req, res) => {
  const logoutUrl = await kindeClient.logout(sessionManager(req, res));
  return res.redirect(logoutUrl.toString());
});

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated = await kindeClient.isAuthenticated(
    sessionManager(req, res)
  );
  if (isAuthenticated) {
    const profile = await kindeClient.getUserProfile(sessionManager(req, res));
    const user = await findUser(profile.id);
    if (!user) {
      const { id, given_name, family_name, email, picture } = profile;
      await createUser({
        id,
        firstName: given_name,
        lastName: family_name,
        email,
        picture,
      });
      await seedFakeTransactions(id, 20);
      if (!(await findUser(id))) throw new Error('failed to create user');
      next();
    } else {
      req.user = user;
      next();
    }
  } else {
    if (req.url.includes('auth')) return next();
    res.redirect('/auth/login');
  }
}

export const authRouter = router;
