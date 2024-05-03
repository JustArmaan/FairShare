import dotenv from 'dotenv';
dotenv.config();

const isDev = process.env.VITE_IS_DEV;
const dbUrl = process.env.VITE_DB_URL;
const authToken = process.env.VITE_AUTH_TOKEN;
const localDb = process.env.VITE_LOCAL_DB_URL;
const kindeClientId = process.env.VITE_KINDE_CLIENT_ID;
const kindeSecret = process.env.VITE_KINDE_SECRET;
const baseUrl = process.env.VITE_BASE_URL;

export const env = {
  isDev,
  dbUrl,
  authToken,
  localDb,
  kindeClientId,
  kindeSecret,
  baseUrl,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value) throw new Error(`Missing env variable for ${key}`);
});
