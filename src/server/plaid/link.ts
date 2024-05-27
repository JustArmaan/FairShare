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
    webhook: 'http://localhost:3000/api/v0/sync',
    country_codes: ['CA'],
    user: {
      client_user_id: user.id,
      email_address: user.email,
    },
    products: ['transactions', 'identity', 'transfer'],
  });
}

export async function simulateWebhook(
  accessToken: string,
  webhookCode: string
) {
  return await plaidRequest('/sandbox/item/fire_webhook', {
    access_token: accessToken,
    webhook_code: webhookCode,
  });
}

export async function simulatWebhookAndGetAccessToken(publicToken: string) {
  const accessToken = await getAccessToken(publicToken);
  console.log(accessToken, 'access');
  simulateWebhook(accessToken, 'SYNC_UPDATES_AVAILABLE')
    .then((response) => console.log('Webhook simulation response:', response))
    .catch((error) => console.error('Error simulating webhook:', error));
}

export async function getAccessToken(publicToken: string) {
  return await plaidRequest('/item/public_token/exchange', {
    public_token: publicToken,
  });
}

console.log(
  await simulatWebhookAndGetAccessToken(
    'access-sandbox-d695ae55-d1d9-49a4-8d4b-1152b4e138db'
  )
);
