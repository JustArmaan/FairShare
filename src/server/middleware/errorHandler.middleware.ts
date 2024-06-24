import express from "express";

interface ErrorWithStatus extends Error {
  status?: number;
}

export function errorHandler(
  error: ErrorWithStatus,
  __: express.Request,
  res: express.Response,
  _: express.NextFunction
) {
  console.error(error, "error caught in the global error handler");

  const status = error.status || 500;
  res.statusCode = status;
  console.error(`Error status: ${status}`);
  res.redirect(`/error/${status}`);
}
