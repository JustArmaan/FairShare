import type { Request, Response, NextFunction } from "express";

export function detectHTMX(
  req: Request,
  res: Response,
  next: NextFunction,
  reloadPath: string = "/fullPageReload"
): void {
  const referer = req.headers.referer;
  const requestedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
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

  if (!referer) {
    req.isHTMX = false;
    next();
    return;
  }

  if (referer && req.url === "/") {
    next();
    return;
  }

  if (req.headers["hx-request"] === "true") {
    req.isHTMX = true;
    next();
  } else {
    req.isHTMX = false;

    if (!requestedUrl.pathname.includes(reloadPath)) {
      requestedUrl.pathname = reloadPath;
      requestedUrl.searchParams.set("url", req.originalUrl); // this sets the url query param
      res.redirect(requestedUrl.toString());
    } else {
      next();
    }
  }
}
