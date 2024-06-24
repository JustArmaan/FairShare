import type { Request, Response, NextFunction } from "express";
import { env } from "../../../env";

export function detectHTMX(
  req: Request,
  res: Response,
  next: NextFunction,
  reloadPath: string = "/fullPageReload"
): void {
  const referer = req.headers.referer;
  const requestedUrl = new URL(
    req.originalUrl,
    env.isDev ? `http://${req.headers.host}` : `https://${req.headers.host}`
  );
  const contentType = req.headers["content-type"];

  const excludePaths = [
    "svg",
    "@",
    "src",
    "node_modules",
    "vite",
    "css",
    "logout",
    "login",
    "register",
    "api",
    "kinde",
    "auth",
    "json",
    "png",
    "js",
    "favicon",
  ];

  const shouldExclude = (url: string) =>
    excludePaths.some((exclude) => url.includes(exclude));

  if (shouldExclude(req.url)) {

    next();
    return;
  }

  if (contentType && !contentType.includes("text/html")) {

    next();
    return;
  }

  if (req.url === "/") {

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });
    next();
    return;
  }

  if (req.headers["hx-request"] === "true") {

    req.isHTMX = true;
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });
    next();
  } else {
    req.isHTMX = false;

    if (!requestedUrl.pathname.includes(reloadPath)) {
      requestedUrl.pathname = reloadPath;
      requestedUrl.searchParams.set("url", req.originalUrl); // this sets the url query param
      console.log("redirect to", requestedUrl.toString());
      res.redirect(requestedUrl.toString());
    } else {
      next();
    }
  }
}
