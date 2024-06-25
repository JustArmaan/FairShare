import express from "express";

interface ErrorWithStatus extends Error {
  status?: number;
}

export function errorHandler(
  error: ErrorWithStatus,
  __: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error(error);
  const status = error.status || 500;
  res.statusCode = status;
  console.error(`status: ${status}`);
  res.redirect(`/error/${status}`);
  // next();
}
