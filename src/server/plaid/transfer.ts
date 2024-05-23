import { getItemsForUser } from '../services/plaid.service';
import { findUser } from '../services/user.service';
import { plaidRequest } from './link';
import { findUserLegalNameForAccount } from './identity';
import {
  createGroupTransfer,
  getSenderTransferStatus,
  getTransferStatusByName,
  getUserGroupTransaction,
  updateGroupTransferToReceive,
} from '../services/plaid.transfer.service';
import { type GroupTransfer } from '../services/plaid.transfer.service';

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
    return response.authorization.id;
  } catch (error) {
    console.error('Error initiating authorization:', error);
    throw error;
  }
}

async function createTransferForSender(
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

    const [{ item }] = await getItemsForUser(userId);
    const accessToken = item.plaidAccessToken;

    const transferCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      description: 'success',
      authorization_id: authorizationId,
    };

    const response = await plaidRequest(
      '/transfer/create',
      transferCreateRequest
    );
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
    };

    const response = await plaidRequest(
      '/transfer/create',
      transferCreateRequest
    );
    console.log('respose', response.transfer);
    return response.transfer;
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw error;
  }
}

export async function createTransferForSenderAndRecord(
  userId: string,
  accountId: string,
  receiverAccountId: string,
  amount: number,
  groupId: string,
  transactionId: string
) {
  try {
    const response = await createTransferForSender(userId, accountId, amount);

    const transferStatus = response.transfer.status;
    const senderStatus = await getTransferStatusByName(transferStatus);
    const receiverStatus = await getTransferStatusByName('pending');

    if (!senderStatus || !receiverStatus) {
      throw new Error('Transfer status not found');
    }

    const groupToUserTransaction = await getUserGroupTransaction(
      groupId,
      transactionId
    );
    if (!groupToUserTransaction) {
      throw new Error('Group transaction not found');
    }

    const groupTransferData: Omit<GroupTransfer, 'id'> = {
      groupTransactionToUsersToGroupsId:
        groupToUserTransaction.groupTransactionToUsersToGroups.id,
      groupTransferSenderStatusId: senderStatus[0].id,
      groupTransferReceiverStatusId: receiverStatus[0].id,
      senderAccountId: accountId,
      receiverAccountId: receiverAccountId,
      senderInitiatedTimestamp: new Date().toISOString(),
      senderCompletedTimestamp: null,
      receiverInitiatedTimestamp: new Date().toISOString(),
      receiverCompletedTimestamp: null,
    };

    await createGroupTransfer(groupTransferData);

    return response.transfer;
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw error;
  }
}

export async function checkAndProcessReceiveTransfer(
  senderAccountId: string,
  receiverUserId: string,
  receiverAccountId: string,
  amount: number
) {
  try {
    const senderStatusResult = await getSenderTransferStatus(senderAccountId);
    if (!senderStatusResult) {
      throw new Error('No transfer found for this sender account ID');
    }

    const { groupTransferStatus, groupTransfer } = senderStatusResult[0];

    if (groupTransferStatus.status === 'completed') {
      const receiverTransfer = await createTransferForReceiver(
        receiverUserId,
        receiverAccountId,
        amount
      );
      console.log('Receiver transfer initiated:', receiverTransfer);
    } else {
      const receiverStatus = await getTransferStatusByName('completed');

      if (!receiverStatus) {
        throw new Error('Receiver status not found');
      }

      await updateGroupTransferToReceive(
        groupTransfer.id,
        receiverStatus[0].id,
        groupTransfer.groupTransferSenderStatusId,
        new Date().toISOString()
      );
      console.log(
        'Sender transfer status is not completed, updated status to rechecking'
      );
    }
  } catch (error) {
    console.error('Error processing transfers:', error);
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
