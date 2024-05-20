import { getItemsForUser } from '../services/plaid.service';
import { findUser } from '../services/user.service';
import { plaidRequest } from './link';
import { findUserLegalNameForAccount } from './identity';

export async function authorizeTransfer(
  userId: string,
  accountId: string,
  amount: number,
  recipientAccountId: string
) {
  const [{ item }] = await getItemsForUser(userId);
  const accessToken = item.plaidAccessToken;

  try {
    const user = await findUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const transferRequest = {
      access_token: accessToken,
      account_id: recipientAccountId,
      type: 'debit',
      network: 'ach',
      amount: amount.toFixed(2).toString(),
      ach_class: 'ppd',
      user: {
        legal_name: await findUserLegalNameForAccount(user.id, accountId),
      },
    };

    const response = await plaidRequest(
      '/transfer/authorization/create',
      transferRequest
    );
    console.log('response', response);
    // console.log('Authorization successful', response.data);
    // console.log('Authorization ID:', response.data.authorization.id);
    return response.data.authorization.id;
  } catch (error) {
    console.error('Error initiating authorization:', error);
    throw error;
  }
}

export async function createTransfer(
  userId: string,
  accountId: string,
  recipientAccountId: string,
  amount: number
) {
  try {
    const authorizationId = await authorizeTransfer(
      userId,
      accountId,
      amount,
      recipientAccountId
    );

    const [{ item }] = await getItemsForUser(userId);
    const accessToken = item.plaidAccessToken;

    const transferCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      description: 'payment to another user',
      authorization_id: authorizationId,
      amount: amount.toString(),
    };

    const response = await plaidRequest(
      '/transfer/create',
      transferCreateRequest
    );
    console.log('respose', response);
    console.log('Transfer successful', response.data);
    return response.data.transfer;
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw error;
  }
}

export async function getTransfer(userId: string, transferId: string) {
  const [{ item }] = await getItemsForUser(userId);
  const accessToken = item.plaidAccessToken;

  try {
    const response = await plaidRequest('/transfer/get', {
      access_token: accessToken,
      transfer_id: transferId,
    });
    console.log('Transfer details:', response.data);
    return response.data.transfer;
  } catch (error) {
    console.error('Error retrieving transfer:', error);
    throw error;
  }
}

createTransfer(
  'kp_ae3fe5538e824f54b990b4f7876c22f8',
  'oGJNBPGkN4sNx1nNpnvAh8gyxdEnnduoQX8G3',
  '3oeLymWKbbcRbb9QBxEvHwLvG48B4oTZVnJPk',
  20
);
