import dotenv from "dotenv";
dotenv.config();

export const env = {
  isDev: process.env.IS_DEV ? true : false,
  dbUrl: process.env.DB_URL,
  authToken: process.env.AUTH_TOKEN,
  localDb: process.env.LOCAL_DB_URL,
  kindeClientId: process.env.KINDE_CLIENT_ID,
  kindeSecret: process.env.KINDE_SECRET,
  kindeAuthDomain: process.env.KINDE_AUTH_DOMAIN,
  baseUrl: process.env.BASE_URL,
  plaidClientId: process.env.PLAID_CLIENT_ID,
  plaidSecret: process.env.PLAID_SECRET,
  plaidApiUrl: process.env.PLAID_API_URL,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  vopayAccountId: process.env.VOPAY_ACCOUNT_ID,
  vopaySharedSecret: process.env.VOPAY_API_SHARED_SECRET,
  vopayKey: process.env.VOPAY_API_KEY,
  vopayUrl: process.env.VOPAY_URL,
  playwrightEmail: process.env.PLAYWRIGHT_EMAIL,
  playwrightPassword: process.env.PLAYWRIGHT_PASSWORD,
  kindeEmailConnectionId: process.env.KINDE_EMAIL_CONNECTION_ID,
  kindeAppleConnectionId: process.env.KINDE_APPLE_CONNECTION_ID,
  kindeGoogleConnectionId: process.env.KINDE_GOOGLE_CONNECTION_ID,
  dbLogging: process.env.DB_LOGGING ? true : false,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value && key !== "isDev" && key !== "dbLogging")
    throw new Error(`Missing env variable for ${key}`);
});
