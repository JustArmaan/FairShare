import express from "express";
import fs from "fs/promises";
import path from "path";
import { formatDate } from "../views/pages/transactions/components/Transaction";

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
  /*
  fs.writeFile(
    path.join(__dirname, "./error.log"),
    JSON.stringify({
      stack: error.stack,
      time: formatDate(new Date().toISOString()),
    }),
    "utf-8"
  ).then(() => console.log("Wrote to error.log"));
  */ //imrpove this
  console.error(`status: ${status}`);
  res.redirect(`/error/${status}`);
  // next();
}
