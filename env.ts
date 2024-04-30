import dotenv from "dotenv";
dotenv.config();

const isDev = process.env.VITE_IS_DEV;
const dbUrl = process.env.VITE_DB_URL;
const authToken = process.env.VITE_AUTH_TOKEN;
const localDb = process.env.VITE_LOCAL_DB_URL;

export const env = {
  isDev: isDev,
  dbUrl: dbUrl,
  authToken: authToken,
  localDb: localDb,
};
