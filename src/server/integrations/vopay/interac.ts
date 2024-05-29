import { env } from '../../../../env';

import crypto from 'crypto';
const shasum = crypto.createHash('sha1');

const key = env.vopayKey!;
const secret = env.vopaySharedSecret!;

function generateVopaySignature() {
  let date: Date | string = new Date();

  // convert to yyyy-mm-dd
  date = date.toISOString().split('T')[0];

  shasum.update(key + secret + date);
  const signature = shasum.digest('hex');
  return signature;
}

export async function vopayRequest(endpoint: string, body: any) {
  try {
    const accountID = env.vopayAccountId!;

    const signature = generateVopaySignature();

    const formData = new URLSearchParams({
      AccountID: accountID,
      Key: key,
      Signature: signature,
      ...body,
    });

    const response = await fetch(`${env.vopayUrl!}/${endpoint}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    console.log(
      `${env.vopayUrl!}/${endpoint}`,
      'endpoint',
      formData.toString(),
      'vopay body'
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

type RequestInteractVopayResponse = {
  Success: boolean;
  TransactionID: number;
  Flagged: string; // need to handle flagged
  ErrorMessage: string;
  TransactionStatus: string;
};

export async function requestInteracTransfer(
  amount: number,
  currency: string,
  receiverEmail: string,
  receiverName: string
) {
  try {
    const response = await vopayRequest('interac/money-request', {
      // required fields
      Amount: amount,
      Currency: currency,
      EmailAddress: receiverEmail,
      RecipientName: receiverName,
      // add more details later
    });

    return response as RequestInteractVopayResponse;
  } catch (e) {
    console.error(e);
  }
}

export async function sendInteracTransfer(
  amount: number,
  currency: string,
  receiverEmail: string,
  receiverName: string,
  question: string,
  answer: string
) {
  try {
    const response = await vopayRequest('interac/bulk-payout', {
      // required fields
      Amount: amount,
      Currency: currency,
      EmailAddress: receiverEmail,
      RecipientName: receiverName,
      Question: question,
      Answer: answer,
      // add more details later
    });
    return response;
  } catch (e) {
    console.error(e);
  }
}
