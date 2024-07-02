import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import { env } from "../../../env";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { createUser, findUser } from "../services/user.service";
import { faker } from "@faker-js/faker";

const colors = [
  "accent-blue",
  "accent-purple",
  "accent-red",
  "accent-yellow",
  "accent-green",
  "category-color-0",
  "category-color-1",
  "category-color-2",
  "category-color-3",
  "category-color-4",
  "category-color-5",
  "category-color-6",
  "category-color-7",
  "category-color-8",
  "category-color-9",
  "category-color-10",
  "category-color-11",
  "category-color-12",
  "category-color-13",
  "category-color-14",
  "category-color-15",
  "category-color-16",
];

const router = express.Router();

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: env.kindeAuthDomain!,
    clientId: env.kindeClientId!,
    clientSecret: env.kindeSecret!,
    redirectURL: `${env.baseUrl}/auth/callback`,
    logoutRedirectURL: env.baseUrl!,
  }
);

export const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
} as const;

export const sessionManager = (
  req: Request | { cookies: Record<string, any> },
  res?: Response
): SessionManager => ({
  async getSessionItem(key: string) {
    if (req.cookies[key] && req.cookies[key] !== "") return req.cookies[key];
    return undefined;
  },
  async setSessionItem(key: string, value: unknown) {
    if (!res) throw new Error("cannot set session without valid res");
    if (typeof value === "string") {
      res.cookie(key, value, cookieOptions);
    } else {
      res.cookie(key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    if (!res) throw new Error("cannot operate on session without valid res");
    console.log("clearing cookie", key);
    res.clearCookie(key, cookieOptions);
  },
  async destroySession() {
    if (!res) throw new Error("cannot operate on session without valid res");
    [
      "ac-state-key",
      "id_token",
      "access_token",
      "user",
      "refresh_token",
    ].forEach((key) => {
      console.log("clearing cookies", key);
      res.clearCookie(key, cookieOptions);
    });
  },
});

router.get("/login", async (req, res) => {
  const loginUrl = await kindeClient.login(sessionManager(req, res));
  return res.redirect(loginUrl.toString());
});

router.get("/register", async (req, res) => {
  const registerUrl = await kindeClient.register(sessionManager(req, res));
  return res.redirect(registerUrl.toString());
});

router.get("/logout", async (req, res) => {
  const logoutUrl = await kindeClient.logout(sessionManager(req, res));
  return res.redirect(logoutUrl.toString());
});

router.get("/callback", async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
  await kindeClient.handleRedirectToApp(sessionManager(req, res), url);
  return res.redirect("/");
});

export async function getUser(req: Request, res: Response, next: NextFunction) {
  if (
    req.get("host")?.includes("render") &&
    !req.get("host")?.includes("localhost") &&
    !req.get("host")?.includes("idsp")
  ) {
    console.log("redirect");
    return res.redirect("https://myfairshare.ca");
  }

  if (
    !req.headers["accept"]?.includes("text/html") &&
    !(req.headers["hx-request"] === "true") &&
    !req.url.includes("api")
  ) {
    return next();
  }

  try {
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(req, res)
    );
    if (isAuthenticated && !req.url.includes("logout")) {
      const profile = await kindeClient.getUserProfile(
        sessionManager(req, res)
      );
      if (!profile) {
        const logoutUrl = await kindeClient.logout(sessionManager(req, res));
        return res.redirect(logoutUrl.toString());
      }
      const user = await findUser(profile.id);
      if (!user) {
        const { id, given_name, family_name, email } = profile;
        await createUser({
          id,
          firstName: given_name,
          lastName: family_name ? family_name : null,
          email,
          color: faker.helpers.arrayElement(colors),
        });
        // await seedFakeTransactions(id, 20);
        if (!(await findUser(id))) throw new Error("failed to create user");
        return next();
      } else {
        req.user = user;
        return next();
      }
    } else {
      if (
        req.url.startsWith(`/auth`) ||
        req.url.startsWith(`/mobile/auth`) ||
        req.url.startsWith(`/onboard`) ||
        req.url === "/"
      ) {
        return next();
      } else {
        res.redirect("/");
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

export const authRouter = router;
