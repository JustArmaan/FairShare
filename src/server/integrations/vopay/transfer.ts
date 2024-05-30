import { findUser } from '../../services/user.service';
import {
  createGroupTransfer,
  getGroupTransferById,
  getAllTransferStatuses,
  updateGroupTransfer,
} from '../../services/plaid.transfer.service';
import {
  requestInteracTransfer,
  sendInteracTransfer,
  vopayRequest,
} from './interac';
import { getOwed } from '../../services/owed.service';

export async function createTransferForSender(
  senderId: string,
  receiverId: string,
  amount: number,
  groupId: string,
  owedId: string
): Promise<void> {
  try {
    const parsedAmount = Math.floor(Math.abs(amount) * 100) / 100;
    const sender = await findUser(senderId);

    // const idempotencyKey = uuid(); // use someday
    const response = await requestInteracTransfer(
      parsedAmount,
      'CAD',
      sender!.email,
      sender!.firstName
    );
    const transferStatus = await getAllTransferStatuses();
    console.log(transferStatus, 'all');
    console.log(response, 'create transfer response');

    if (response?.Success) {
      await createGroupTransfer(
        {
          groupTransactionToUsersToGroupsId: owedId,
          groupTransferSenderStatusId: transferStatus!.find(
            ({ status }) => status === 'requested'
          )!.id,
          groupTransferReceiverStatusId: transferStatus!.find(
            ({ status }) => status === 'not-initiated'
          )!.id,
          senderUserId: senderId,
          receiverUserId: receiverId,
          senderCompletedTimestamp: null,
          senderInitiatedTimestamp: new Date().toISOString(),
          receiverCompletedTimestamp: null,
          receiverInitiatedTimestamp: null,
          senderVopayTransferId: response.TransactionID.toString(),
          receiverVopayTransferId: null,
        },
        groupId
      );
      console.log('created transfer for sender', sender!.firstName);
    }
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw error;
  }
}

export async function createTransferForReceiver(
  transferId: string,
  receiverId: string,
  transactionIdReceiver: string,
  question: string,
  answer: string
) {
  try {
    const transfer = await getGroupTransferById(transferId);
    const receiver = await findUser(receiverId);
    const owed = await getOwed(transfer!.groupTransactionToUsersToGroupsId);

    // const idempotencyKey = uuid(); // use someday
    const response = await sendInteracTransfer(
      Math.abs(owed!.amount),
      'CAD',
      receiver!.email,
      receiver!.firstName,
      question,
      answer
    );
    const transferStatuses = await getAllTransferStatuses();

    console.log(response, 'create transfer response receiver');
    if (response.Success) {
      await updateGroupTransfer(transfer!.id, {
        groupTransferSenderStatusId: transferStatuses!.find(
          ({ status }) => status === 'complete'
        )!.id,
        groupTransferReceiverStatusId: transferStatuses!.find(
          ({ status }) => status === 'requested'
        )!.id,
        senderCompletedTimestamp: new Date().toISOString(),
        receiverInitiatedTimestamp: new Date().toISOString(),
        receiverVopayTransferId: transactionIdReceiver,
      });
    }
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw error;
  }
}

export async function setupVopayTransactionWebhook() {
  const response = await vopayRequest('account/webhook-url', {
    WebHookUrl:
      'https://73bf-142-232-219-22.ngrok-free.app/api/v0/vopay-transactions-webhook',
    Type: 'transaction',
  });
  console.log(response, 'webhook setup response');
}

export async function completeTransfer(transferId: string) {
  try {
    const transferStatuses = (await getAllTransferStatuses())!;
    await updateGroupTransfer(transferId, {
      groupTransferReceiverStatusId: transferStatuses.find(
        (transfer) => transfer.status === 'sent'
      )!.id,
      receiverCompletedTimestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
  }
}
