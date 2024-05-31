import { plaidRequest } from './link';
import { getItemsForUser } from '../../services/plaid.service';

export async function findUserLegalNameForAccount(
  userId: string,
  accountId: string
) {
  try {
    const items = await getItemsForUser(userId);
    if (!items || items.length === 0) {
      console.error('No items found for user:', userId);
      throw new Error('No items found for user');
    }
    const [{ item }] = items;
    const accessToken = item.plaidAccessToken;
    if (!accessToken) {
      console.error('No access token available in item:', item);
      throw new Error('Access token is missing');
    }
    const response = await plaidRequest('/identity/get', {
      access_token: accessToken,
    });

    if (!response || !response.accounts || response.accounts.length === 0) {
      console.error('Account data is missing in the response');
      throw new Error('Account data is missing in the response');
    }

    const account = response.accounts.find(
      (acc: { account_id: string }) => acc.account_id === accountId
    );

    if (!account) {
      console.error(`No account found for accountId: ${accountId}`);
      throw new Error(`No account found for accountId: ${accountId}`);
    }

    if (
      !account.owners ||
      account.owners.length === 0 ||
      !account.owners[0].names ||
      account.owners[0].names.length === 0
    ) {
      console.error('Name data is missing for the account');
      throw new Error('Name data is missing for the account');
    }

    const ownerName = account.owners[0].names[0];
    return ownerName;
  } catch (error) {
    console.error('Error finding identity:', error);
    throw error;
  }
}
