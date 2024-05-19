import { env } from '../../../env';

export async function plaidRequest(endpoint: string, body: any) {
  try {
    const clientId = env.plaidClientId as string;
    const secret = env.plaidSecret as string;

    const response = await fetch(`${env.plaidApiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ client_id: clientId, secret, ...body }),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function getLinkToken(user: { id: string; email: string }) {
  return await plaidRequest('/link/token/create', {
    client_name: 'FairShare',
    language: 'en',
    country_codes: ['CA'],
    user: {
      client_user_id: user.id,
      email_address: user.email,
    },
    products: ['transactions'],
  });
}

export async function getAccessToken(publicToken: string) {
  return await plaidRequest('/item/public_token/exchange', {
    public_token: publicToken,
  });
}
