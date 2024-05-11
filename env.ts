import dotenv from 'dotenv';
dotenv.config();

export const env = {
  isDev: process.env.VITE_IS_DEV ? true : false,
  dbUrl: process.env.VITE_DB_URL,
  authToken: process.env.VITE_AUTH_TOKEN,
  localDb: process.env.VITE_LOCAL_DB_URL,
  kindeClientId: process.env.VITE_KINDE_CLIENT_ID,
  kindeSecret: process.env.VITE_KINDE_SECRET,
  kindeAuthDomain: process.env.VITE_KINDE_AUTH_DOMAIN,
  baseUrl: process.env.VITE_BASE_URL,
  plaidClientId: process.env.VITE_PLAID_CLIENT_ID,
  plaidSecret: process.env.VITE_PLAID_SECRET,
  googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value && key !== 'isDev')
    throw new Error(`Missing env variable for ${key}`);
});
