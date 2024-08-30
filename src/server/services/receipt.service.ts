import { getDB } from "../database/client";
import { transactionReceipt } from "../database/schema/transactionReceipt";
import { receiptLineItem } from "../database/schema/receiptLineItem";
import { eq } from "drizzle-orm";
import type { ExtractFunctionReturnType } from "./user.service";
import type { ArrayElement } from "../interface/types";
import { groupTransactionToUsersToGroupsStatus } from "../database/schema/groupTransactionToUsersToGroupStatus";
import { v4 as uuidv4 } from "uuid";
import { groupTransactionState } from "../database/schema/groupTransactionState";
import { splitType } from "../database/schema/splitType";
import { getUsersToGroup } from "./group.service";
import { groupTransactionToUsersToGroups } from "../database/schema/groupTransactionToUsersToGroups";
import { receiptLineItemToGroupTransaction } from "../database/schema/receiptLineItemToGroupTransaction";

const db = getDB();

export async function getReceipt(id: string) {
  const results = await db
    .select()
    .from(transactionReceipt)
    .where(eq(transactionReceipt.id, id));

  return results;
}

export type Receipt = ExtractFunctionReturnType<typeof getReceipt>;

export async function createReceipt(receipt: Receipt) {
  const result = await db
    .insert(transactionReceipt)
    .values(receipt)
    .returning();

  return result[0];
}

export async function getReceiptLineItems(receiptId: string) {
  const results = await db
    .select()
    .from(receiptLineItem)
    .where(eq(receiptLineItem.transactionReceiptId, receiptId));

  return results;
}

export async function getReceiptLineItem(id: string) {
  const results = await db
    .select()
    .from(receiptLineItem)
    .where(eq(receiptLineItem.id, id));

  return results;
}

export type ReceiptLineItems = ExtractFunctionReturnType<
  typeof getReceiptLineItems
>;

export type ReceiptLineItem = ArrayElement<ReceiptLineItems>;

export async function createReceiptLineItems(
  receiptLineItems: ReceiptLineItems
) {
  let results: ReceiptLineItems = [];

  receiptLineItems.forEach(async (item) => {
    let result = await db.insert(receiptLineItem).values(item).returning();
    if (result !== undefined && result[0] !== undefined && result.length > 0) {
      results.push(result[0]);
    }
  });

  return results;
}

export async function getReceiptDetailsFromReceiptItemId(
  receiptItemId: string
) {
  const results = await db
    .select()
    .from(receiptLineItem)
    .innerJoin(
      transactionReceipt,
      eq(receiptLineItem.transactionReceiptId, transactionReceipt.id)
    )
    .where(eq(receiptLineItem.id, receiptItemId));

  if (results.length === 0) {
    return undefined;
  }

  return results[0];
}

export async function splitReceiptEquallyBetweenMembers(
  userIds: string[],
  receipId: string
) {
  const receipt = await getReceipt(receipId);
  if (receipt.length === 0) {
    console.log("Error getting receipt");
    return undefined;
  }

  userIds.map(async (userId) => {
    const splitTypeResult = await db
      .select()
      .from(splitType)
      .where(eq(splitType.type, "equal"));

    if (splitTypeResult.length === 0) {
      console.log("Error getting split type");
      return undefined;
    }

    const userToGroup = await getUsersToGroup(receipt[0].groupId, userId);

    if (userToGroup === undefined) {
      console.log("Error getting user to group");
      return undefined;
    }

    const groupTransactionStateResult = await db
      .insert(groupTransactionState)
      .values({
        id: uuidv4(),
        pending: true,
        splitTypeId: splitTypeResult[0].id,
      })
      .returning();

    const groupTransactionToUserToGroupStatus = await db
      .insert(groupTransactionToUsersToGroupsStatus)
      .values({ id: uuidv4(), status: "notSent" })
      .returning();

    if (groupTransactionStateResult.length === 0) {
      console.log("Error creating group transaction state");
      return undefined;
    }

    await db.insert(groupTransactionToUsersToGroups).values({
      id: uuidv4(),
      amount: receipt[0].total / userIds.length,
      groupTransactionStateId: groupTransactionStateResult[0].id,
      usersToGroupsId: userToGroup!.id,
      groupTransactionToUsersToGroupsStatusId:
        groupTransactionToUserToGroupStatus[0].id,
    });
  });
}

export async function splitReceiptByAmount(
  userAmounts: { userId: string; amount: number }[],
  receiptId: string
) {
  const receipt = await getReceipt(receiptId);
  if (receipt.length === 0) {
    console.log("Error getting receipt");
    return undefined;
  }

  for (const { userId, amount } of userAmounts) {
    const splitTypeResult = await db
      .select()
      .from(splitType)
      .where(eq(splitType.type, "amount"));

    if (splitTypeResult.length === 0) {
      console.log("Error getting split type");
      return undefined;
    }

    const userToGroup = await getUsersToGroup(receipt[0].groupId, userId);

    if (userToGroup === undefined) {
      console.log("Error getting user to group");
      return undefined;
    }

    const groupTransactionStateResult = await db
      .insert(groupTransactionState)
      .values({
        id: uuidv4(),
        pending: true,
        splitTypeId: splitTypeResult[0].id,
      })
      .returning();

    const groupTransactionToUserToGroupStatus = await db
      .insert(groupTransactionToUsersToGroupsStatus)
      .values({ id: uuidv4(), status: "notSent" })
      .returning();

    if (groupTransactionStateResult.length === 0) {
      console.log("Error creating group transaction state");
      return undefined;
    }

    const groupTransactionToUsersToGroupsResult = await db
      .insert(groupTransactionToUsersToGroups)
      .values({
        id: uuidv4(),
        amount: amount,
        groupTransactionStateId: groupTransactionStateResult[0].id,
        usersToGroupsId: userToGroup!.id,
        groupTransactionToUsersToGroupsStatusId:
          groupTransactionToUserToGroupStatus[0].id,
      })
      .returning();
    return groupTransactionToUsersToGroupsResult;
  }
}

export async function createSplitReceiptLineItem(
  receiptLineItemId: string,
  groupTransactionToUsersToGroupsId: string,
  amount: number
) {
  const result = await db
    .insert(receiptLineItemToGroupTransaction)
    .values({
      id: uuidv4(),
      receiptLineItemId,
      groupTransactionId: groupTransactionToUsersToGroupsId,
      amount,
    })
    .returning();

  return result[0];
}
