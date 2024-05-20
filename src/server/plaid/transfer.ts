import { getItemsForUser } from '../services/plaid.service';
import { findUser } from '../services/user.service';
import { plaidRequest } from './link';
import { findUserLegalNameForAccount } from './identity';

export async function authorizeSendersTransfer(
  userId: string,
  accountId: string,
  amount: number
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
      account_id: accountId,
      type: 'debit',
      network: 'ach',
      amount: amount.toFixed(2).toString(),
      ach_class: 'web',
      user: {
        legal_name: await findUserLegalNameForAccount(user.id, accountId),
      },
    };

    const response = await plaidRequest(
      '/transfer/authorization/create',
      transferRequest
    );

    return response.authorization.id;
  } catch (error) {
    console.error('Error initiating authorization:', error);
    throw error;
  }
}

export async function authorizeReceiversTransfer(
  userId: string,
  accountId: string,
  amount: number
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
      account_id: accountId,
      type: 'credit',
      network: 'ach',
      amount: amount.toFixed(2).toString(),
      ach_class: 'web',
      user: {
        legal_name: await findUserLegalNameForAccount(user.id, accountId),
      },
    };

    const response = await plaidRequest(
      '/transfer/authorization/create',
      transferRequest
    );
    console.log('response', response);
    return response.authorization.id;
  } catch (error) {
    console.error('Error initiating authorization:', error);
    throw error;
  }
}

export async function createTransferForSender(
  userId: string,
  accountId: string,
  amount: number
) {
  try {
    const authorizationId = await authorizeSendersTransfer(
      userId,
      accountId,
      amount
    );

    console.log(authorizationId, 'authoization');

    const [{ item }] = await getItemsForUser(userId);
    const accessToken = item.plaidAccessToken;

    const transferCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      description: 'success',
      authorization_id: authorizationId,
      //   amount: amount.toString(),
    };

    const response = await plaidRequest(
      '/transfer/create',
      transferCreateRequest
    );
    console.log('respose', response);
    console.log('Transfer successful', response.transfer);
    return response.transfer;
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw error;
  }
}

export async function createTransferForReceiver(
  userId: string,
  accountId: string,
  amount: number
) {
  try {
    const authorizationId = await authorizeReceiversTransfer(
      userId,
      accountId,
      amount
    );

    const [{ item }] = await getItemsForUser(userId);
    const accessToken = item.plaidAccessToken;

    const transferCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      description: 'payment good',
      authorization_id: authorizationId,
      //   amount: amount.toString(),
    };

    const response = await plaidRequest(
      '/transfer/create',
      transferCreateRequest
    );
<<<<<<< HEAD
    console.log('respose', response.transfer);
    return response.transfer;
=======
    console.log('response', response);
    console.log('Transfer successful', response.data);
    return response.data.transfer;
>>>>>>> a1a2ca1874df9ca386ab63a403c2614ff5c026c1
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

console.log(
  await createTransferForSender(
    'kp_ae3fe5538e824f54b990b4f7876c22f8',
    'Qw7JoB56jQSDg5BvEkq9i5eGvd9N7lcw6Lajz',
    20
  )
);
