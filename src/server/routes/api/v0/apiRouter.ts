import { Router } from "express";
import {
  getAccessToken,
  getInstitutionDetails,
  getLinkToken,
} from "../../../integrations/plaid/link";
import {
  addItemToUser,
  getAccountsForUser,
  getItemsForUser,
} from "../../../services/plaid.service";
import { syncTransactionsForUser } from "../../../integrations/plaid/sync";
import { findUser, getUserByItemId } from "../../../services/user.service";
import crypto from "crypto";
import { env } from "../../../../../env";
import {
  completeTransfer,
  createTransferForReceiver,
} from "../../../integrations/vopay/transfer";
import { getGroupTransferByTransactionId } from "../../../services/plaid.transfer.service";
import { getGroup, getGroupByOwedId } from "../../../services/group.service";

const router = Router();

router.get("/session", (req, res) => {
  try {
    const data = [
      "ac-state-key",
      "id_token",
      "access_token",
      "user",
      "refresh_token",
    ].reduce((acc, key) => {
      return { ...acc, [key]: req.cookies[key] };
    }, {});
    res.json({ error: null, data });
  } catch (e) {
    res.json({ error: e });
  }
});

router.get("/connected", async (req, res) => {
  if (!req.user) {
    return res.json({
      error: "Not logged in.",
      data: null,
    });
  }

  const items = await getItemsForUser(req.user.id);
  const connected = items.length > 0;
  return res
    .set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    })
    .json({
      error: null,
      data: { connected, count: items.length },
    });
});

router.get("/has-accounts", async (req, res) => {
  if (!req.user) {
    return res.json({
      error: "Not logged in.",
      data: null,
    });
  }

  const items = await getItemsForUser(req.user.id);
  const accounts = items[0]
    ? await getAccountsForUser(req.user.id, items[0].item.id)
    : [];
  const connected = accounts && accounts.length > 0;
  return res
    .set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    })
    .json({
      error: null,
      data: { connected },
    });
});

router.post("/sync", async (req, res) => {
  const { item_id } = req.body as { [key: string]: string };
  if (
    req.body.webhook_code === "SYNC_UPDATES_AVAILABLE" ||
    req.body.webhook_code === "DEFAULT_UPDATE" ||
    req.body.webhook_code === "NEW_ACCOUNTS_AVAILABLE"
  ) {
    if (!item_id) return res.status(400).send();
    const { id } = (await getUserByItemId(item_id))!;
    await syncTransactionsForUser(id);

    console.log("synced up");
  }
  return res.status(200).send();
});

router.get("/sync", async (req, res) => {
  if (!req.user) {
    return res.json({
      error: "Not logged in.",
      data: null,
    });
  }

  await syncTransactionsForUser(req.user.id);
  return res.status(200).send();
});

router.get("/plaid-token", async (req, res) => {
  if (!req.user) {
    return res.json({
      error: "Not logged in.",
      data: null,
    });
  }

  const token = await getLinkToken(req.user);
  res.json({
    error: null,
    data: token,
  });
});

router.post("/plaid-public-token", async (req, res) => {
  if (!req.user) {
    return res.status(403).json({
      error: "Not logged in.",
      data: null,
    });
  }

  const { publicToken } = req.body;
  if (!publicToken) {
    return res.status(400).json({ error: "Missing public token.", data: null });
  }

  try {
    const { access_token, item_id } = await getAccessToken(
      publicToken as string
    );

    const existingItemResults = await getItemsForUser(req.user.id);
    if (existingItemResults.some((result) => result.item.id === item_id)) {
      return res.json({ error: "Institution already connected.", data: null });
    }

    const details = await getInstitutionDetails(access_token);
    await addItemToUser(req.user.id, {
      id: item_id as string,
      plaidAccessToken: access_token,
      nextCursor: null,
      institutionName: details.name,
      logo: details.logo,
      url: details.url,
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error, data: null });
  }
});

function calculateKey(apiSharedSecret: string, transactionID: string): string {
  return crypto
    .createHash("sha1")
    .update(apiSharedSecret + transactionID)
    .digest("hex");
}

/*
  *
  * {
  "Success": true,
  "Status": "sent",
  "ID": "2254962",
  "TransactionAmount": "44.70",
  "TransactionType": "moneyrequest",
  "TransactionID": "2254962",
  "AccountID": "vitorakiyama",
  "UpdatedAt": "2024-05-30 20:21:22",
  "ValidationKey": "0979097a1e9d373254d6ac109e39341399588d32",
  "Environment": "Sandbox"
}
  */

// router.post("/vopay-transactions-webhook", async (req, res) => {
//   try {
//     const payload = req.body as {
//       TransactionID: string;
//       Status: string;
//       ValidationKey: string;
//       TransactionType: string;
//       TransactionAmount: number;
//     };
//     if (
//       payload.ValidationKey !==
//       calculateKey(env.vopaySharedSecret!, payload.TransactionID)
//     )
//       return res.status(404).send(); // simulate an empty route
//     if (
//       payload.TransactionType === "moneyrequest" &&
//       payload.Status === "successful"
//     ) {
//       const groupTransfer = (await getGroupTransferByTransactionId(
//         payload.TransactionID
//       ))!;
//       await createTransferForReceiver(
//         groupTransfer.id,
//         groupTransfer.receiverUserId,
//         payload.TransactionID,
//         "test question",
//         "test answer"
//       );
//       const group = await getGroupByOwedId(
//         groupTransfer.groupTransactionToUsersToGroupsId
//       );
//       const sender = await findUser(groupTransfer.senderUserId);
//       await createNotificationWithWebsocket(
//         group!.id,
//         `${sender!.firstName} has sent you $${
//           payload.TransactionAmount
//         }, please check your email for details.`,
//         groupTransfer.receiverUserId,
//         "groupInvite"
//       );
//     }

//     if (
//       payload.TransactionType === "bulkpayout" &&
//       payload.Status === "successful"
//     ) {
//       const groupTransfer = (await getGroupTransferByTransactionId(
//         payload.TransactionID
//       ))!;
//       await completeTransfer(groupTransfer.id);

//       const group = await getGroupByOwedId(
//         groupTransfer.groupTransactionToUsersToGroupsId
//       );

//       const sender = await findUser(groupTransfer.senderUserId);
//       const receiver = await findUser(groupTransfer.receiverUserId);
//       await createNotificationWithWebsocket(
//         group!.id,
//         `Your transfer to ${receiver!.firstName} of $${
//           payload.TransactionAmount
//         } has been completed!`,
//         groupTransfer.senderUserId,
//         "groupInvite"
//       );

//       await createNotificationWithWebsocket(
//         group!.id,
//         `${sender!.firstName}'s transfer to your account has been completed!`,
//         groupTransfer.receiverUserId,
//         "groupInvite"
//       );
//     }
//   } catch (e) {
//     console.error(e);
//   }
// });

router.get("/groups/getname/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const group = await getGroup(groupId);
  if (!group) {
    return res.status(404).json({ error: "Group not found", data: null });
  }
  return res.json({ error: null, data: { name: group.name } });
});

export const apiRouterV0 = router;
