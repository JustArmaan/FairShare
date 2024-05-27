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
    webhook: 'https://webhook-test.com/6e01dd32c49260f243275fbab1f5e123',
    country_codes: ['CA'],
    user: {
      client_user_id: user.id,
      email_address: user.email,
    },
    products: ['transactions', 'identity', 'transfer'],
  });
}

export async function simulateWebhook(accessToken: string, webhookType: string, webhookCode: string) {
  return await plaidRequest("/sandbox/item/fire_webhook", {
    access_token: accessToken,
    webhook_type: webhookType,
    webhook_code: webhookCode,
  });
}

simulateWebhook('your-access-token', 'TRANSFER', 'TRANSFER_COMPLETED')
  .then(response => console.log('Webhook simulation response:', response))
  .catch(error => console.error('Error simulating webhook:', error));


export async function getAccessToken(publicToken: string) {
  return await plaidRequest('/item/public_token/exchange', {
    public_token: publicToken,
  });
}
