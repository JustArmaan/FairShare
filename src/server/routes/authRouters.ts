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
  authDomain: 'https://idsp1expensetracker.kinde.com',
  clientId: env.kindeClientId!,
  clientSecret: env.kindeSecret!,
  redirectURL: `${env.baseUrl}/auth/callback`,
  logoutRedirectURL: 'http://localhost:3000',
});

let store: Record<string, unknown> = {};

const sessionManager: SessionManager = {
  async getSessionItem(key: string) {
    return store[key];
  },
  async setSessionItem(key: string, value: unknown) {
    store[key] = value;
  },
  async removeSessionItem(key: string) {
    delete store[key];
  },
  async destroySession() {
    store = {};
  },
};

router.get('/login', async (_, res) => {
  const loginUrl = await kindeClient.login(sessionManager);
  console.log(loginUrl.toString(), '/login route hit');
  return res.redirect(loginUrl.toString());
});

router.get('/register', async (_, res) => {
  const registerUrl = await kindeClient.register(sessionManager);
  return res.redirect(registerUrl.toString());
});

router.get('/callback', async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get('host')}${req.url}`);
  console.log(url.toString(), '/callback hit');
  await kindeClient.handleRedirectToApp(sessionManager, url);
  return res.redirect('/');
});

router.get('/logout', async (_, res) => {
  const logoutUrl = await kindeClient.logout(sessionManager);
  return res.redirect(logoutUrl.toString());
});

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager);
  if (isAuthenticated) {
    const profile = await kindeClient.getUserProfile(sessionManager);
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
    console.log(req.url, 'req url');
    if (req.url.includes('auth')) return next();
    res.redirect('/auth/login');
  }
}

export const authRouter = router;
