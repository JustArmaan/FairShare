import { faker } from "@faker-js/faker";
import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { renderToHtml } from "jsxte";
import { env } from "../../../env";
import { createUser, findUser } from "../services/user.service";
import { EnterInfoRegisterPage } from "../views/pages/Login-Register/EnterInfoRegisterPage";
import { LoginPage } from "../views/pages/Login-Register/LoginPage";
import { RegisterPage } from "../views/pages/Login-Register/RegisterPage";

const colors = [
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
  secure: env.isDev ? false : true,
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
  console.log("🔔 Callback hit");
  try {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
    await kindeClient.handleRedirectToApp(sessionManager(req, res), url);
    return res.redirect("/");
  } catch (err) {
    console.error("❌ Callback error:", err);
    return res.status(500).send("Auth callback failed: " + String(err));
  }
});

router.get("/loginPage", async (req, res) => {
  const html = renderToHtml(<LoginPage />);
  res.send(html);
});

router.get("/registerPage", async (req, res) => {
  const html = renderToHtml(<RegisterPage />);
  res.send(html);
});

router.post("/registerContinue", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }
  if (!email || !password || !confirmPassword) {
    return res.status(400).send("Missing email or password");
  }
  const html = renderToHtml(<EnterInfoRegisterPage email={email} />);
  res.send(html);
});

router.get("/apple", async (req, res) => {
  const sessionManagement = sessionManager(req, res);
  try {
    const appleLoginUrl = await kindeClient.login(sessionManagement, {
      authUrlParams: { connection_id: env.kindeAppleConnectionId },
    });
    res.redirect(appleLoginUrl.toString());
  } catch (error) {
    console.error("Failed to initiate Apple login:", error);
    res.status(500).send("Failed to initiate login with Apple.");
  }
});

router.get("/google", async (req, res) => {
  const sessionManagement = sessionManager(req, res);
  try {
    const googleLoginUri = await kindeClient.login(sessionManagement, {
      authUrlParams: { connection_id: env.kindeGoogleConnectionId },
    });
    res.redirect(googleLoginUri.toString());
  } catch (error) {
    console.error("Failed to initiate Google login:", error);
    res.status(500).send("Failed to initiate login with Google.");
  }
});

router.get("/email", async (req, res) => {
  const sessionManagement = sessionManager(req, res);
  try {
    const emailLoginUrl = await kindeClient.login(sessionManagement, {
      authUrlParams: {
        connection_id: env.kindeEmailConnectionId,
        login_hint: "email",
      },
    });
    res.redirect(emailLoginUrl.toString());
  } catch (error) {
    console.error("Failed to initiate Email login:", error);
    res.status(500).send("Failed to initiate login with Email.");
  }
});

export async function getUser(req: Request, res: Response, next: NextFunction) {
  if (
    req.get("host")?.includes("render") &&
    !req.get("host")?.includes("localhost") &&
    !req.get("host")?.includes("idsp")
  ) {
    return res.redirect("https://myfairshare.ca");
  }

  if (
    (!req.headers["accept"]?.includes("text/html") &&
      !(req.headers["hx-request"] === "true") &&
      !req.url.includes("api")) ||
    (req.url.endsWith("/sync") && req.method === "POST") ||
    req.url.endsWith(".svg") ||
    req.url.endsWith(".jpg") ||
    req.url.endsWith(".jpeg") ||
    req.url.endsWith(".png") ||
    req.url.endsWith(".css") ||
    req.url.endsWith(".js") ||
    req.url.endsWith(".ts") ||
    req.url.endsWith(".ico") ||
    req.url.endsWith(".json") ||
    req.url.endsWith(".woff") ||
    req.url.endsWith(".woff2") ||
    req.url.endsWith(".ttf") ||
    req.url.endsWith(".webp")
  ) {
    return next();
  }

  console.log("checking for auth");
  console.log(req.cookies, " for request ", req.url, "with method ", req.method);

  const isAuthenticated = await kindeClient.isAuthenticated(
    sessionManager(req, res)
  );

  if (isAuthenticated && !req.url.includes("logout")) {
    const profile = await kindeClient.getUserProfile(sessionManager(req, res));

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
      if (!(await findUser(id))) throw new Error("failed to create user");
      return next();
    } else {
      req.user = user;
      return next();
    }
  } else {
    if (
      req.url.startsWith("/auth") ||
      req.url.startsWith("/mobile/auth") ||
      req.url.startsWith("/onboard") ||
      req.url.startsWith("/header") ||
      req.url.startsWith("/nav") ||
      req.url.startsWith("/signin") ||
      req.url.startsWith("/boot") ||
      req.url === "/"
    ) {
      return next();
    } else {
      if (req.url.includes("invite")) {
        res.cookie("redirect", req.originalUrl, {
          ...cookieOptions,
          httpOnly: false,
        });
      }
      return res.redirect("/auth/login");
    }
  }
}

export const authRouter = router;
