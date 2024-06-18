import type { Request, Response, NextFunction } from "express";

export function detectHTMX(
  req: Request,
  res: Response,
  next: NextFunction,
  reloadPath: string = "/fullPageReload" 
): void {
  const referer = req.headers.referer;
  const host = req.headers.host;
  const requestedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);

  const excludePaths = ["svg", "@", "src", "node_modules", "vite", "css"];

  const shouldExclude = (url: string) =>
    excludePaths.some((exclude) => url.includes(exclude));

  if (shouldExclude(req.url)) {
    next();
    return;
  }

  if (req.headers["hx-request"] === "true") {

    req.isHTMX = true;
    next();
  } else {
    req.isHTMX = false;
    console.log("Internal navigation or refresh detected.");

    if (!requestedUrl.pathname.includes(reloadPath)) {
      requestedUrl.pathname = reloadPath;
      requestedUrl.searchParams.set("url", req.originalUrl);
      console.log("Redirecting to full page reload:", requestedUrl.toString());
      console.log("Original URL:", req.originalUrl);
      res.redirect(requestedUrl.toString());
    } else {
      next();
    }
  }
}
