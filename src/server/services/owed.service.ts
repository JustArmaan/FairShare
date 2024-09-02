import { and, eq, or } from "drizzle-orm";
import { getDB } from "../database/client";
import { groupTransactionToUsersToGroups } from "../database/schema/groupTransactionToUsersToGroups";
import { transactionsToGroups } from "../database/schema/transactionsToGroups";
import { usersToGroups } from "../database/schema/usersToGroups";
import type { ExtractFunctionReturnType } from "./user.service";
import { v4 as uuid } from "uuid";
import { users } from "../database/schema/users";
import { groupTransactionState } from "../database/schema/groupTransactionState";
import { splitType } from "../database/schema/splitType";
import { transactions } from "../database/schema/transaction";
import { groupTransactionToUsersToGroupsStatus } from "../database/schema/groupTransactionToUsersToGroupStatus";
import type { OwedStatus } from "../database/seed";
import { groups } from "../database/schema/group";
import { io } from "../main";
import { accounts } from "../database/schema/accounts";
import { cashAccount } from "../database/schema/cashAccount";
import { plaidAccount } from "../database/schema/plaidAccount";
import { items } from "../database/schema/items";
import {
  createGenericNotificationWithWebsocket,
  createGroupNotificationWithWebsocket,
} from "../utils/createNotification";
import { get } from "https";
import type { UserSchema } from "../interface/types";

type Owed = ExtractFunctionReturnType<typeof getOwed>;

const db = getDB();

async function getGroupTransactionState(id: string) {
  try {
    const result = await db
      .select()
      .from(groupTransactionState)
      .where(eq(groupTransactionState.id, id));
    return result[0];
  } catch (e) {
    console.trace();
  }
}

type GroupTransactionState = ExtractFunctionReturnType<
  typeof getGroupTransactionState
>;

export async function createGroupTransactionState(
  newGroupTransactionState: Omit<GroupTransactionState, "id" | "splitTypeId">
) {
  try {
    const equalSplit = await db
      .select()
      .from(splitType)
      .where(eq(splitType.type, "equal"));

    return await db
      .insert(groupTransactionState)
      .values({
        ...newGroupTransactionState,
        id: uuid(),
        splitTypeId: equalSplit[0].id,
      })
      .returning();
  } catch (e) {
    console.log(e, "at getGroupTransactionState");
  }
}

export async function createOwed(owed: Omit<Owed, "id">) {
  const id = uuid();
  const newState = await db
    .select()
    .from(groupTransactionToUsersToGroupsStatus)
    .where(eq(groupTransactionToUsersToGroupsStatus.status, "notSent"));
  await db.insert(groupTransactionToUsersToGroups).values({
    ...owed,
    id,
    groupTransactionToUsersToGroupsStatusId: newState[0].id,
  });

  const { userId, firstName } = (
    await db
      .select({ userId: usersToGroups.userId, firstName: users.firstName })
      .from(usersToGroups)
      .innerJoin(users, eq(users.id, usersToGroups.userId))
      .where(eq(usersToGroups.id, owed.usersToGroupsId))
  )[0];

  const { groupId } = (
    await db
      .select({ groupId: usersToGroups.groupId })
      .from(usersToGroups)
      .where(eq(usersToGroups.id, owed.usersToGroupsId))
  )[0];

  io.to(userId).emit("updateGroup", { groupId });
  if (owed.amount < 0) {
    await createGroupNotificationWithWebsocket(
      groupId,
      "addOwed",
      userId,
      (await getTransactionOwnerFromOwedId(id)).id,
      `${firstName} has split a transaction with you for $${Math.abs(owed.amount).toFixed(2)}`
    );
  }
}

export async function getOwed(id: string) {
  try {
    const results = await db
      .select()
      .from(groupTransactionToUsersToGroups)
      .where(eq(groupTransactionToUsersToGroups.id, id));
    return results[0];
  } catch (e) {
    return null;
  }
}

export async function getGroupIdAndTransactionIdForOwed(owedId: string) {
  try {
    const results = await db
      .select({
        groupId: transactionsToGroups.groupsId,
        transactionId: transactionsToGroups.transactionId,
      })
      .from(groupTransactionToUsersToGroups)
      .innerJoin(
        groupTransactionState,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        transactionsToGroups,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .where(eq(groupTransactionToUsersToGroups.id, owedId));
    return results[0];
  } catch (e) {
    console.error(e, "at getGroupIdAndTransactionForOwed");
    return null;
  }
}

export async function getAllOwedForGroupTransactionWithMemberInfo(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select({
        user: users,
        amount: groupTransactionToUsersToGroups.amount,
        owedId: groupTransactionToUsersToGroups.id,
      })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );

    return [
      ...results.map((result) => ({
        ...result,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}

export async function getAllOwedForGroupTransactionNotPendingWithMemberInfo(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select({
        user: users,
        amount: groupTransactionToUsersToGroups.amount,
        owedId: groupTransactionToUsersToGroups.id,
      })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId),
          eq(groupTransactionState.pending, false)
        )
      );

    return [
      ...results.map((result) => ({
        ...result,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}

export type OwedTransactionWithMember = NonNullable<
  Awaited<ReturnType<typeof getAllOwedForGroupTransactionWithMemberInfo>>
>;

export async function getAllOwedForGroupTransaction(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          transactionsToGroups.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );

    return [
      ...results.map((result) => ({
        amount: result.groupTransactionToUsersToGroups.amount,
        userId: result.usersToGroups.userId,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}

export async function getAllOwedForGroupTransactionWithTransactionId(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );

    return [
      ...results.map((result) => ({
        amount: result.groupTransactionToUsersToGroups.amount,
        userId: result.usersToGroups.userId,
        transactionId: result.transactionsToGroups.transactionId,
        pending: result.groupTransactionState.pending,
        groupTransactionToUsersToGroupsId:
          result.groupTransactionToUsersToGroups.id,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}

export async function getAllOwedForGroupPendingTransactionWithTransactionId(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId),
          eq(groupTransactionState.pending, true)
        )
      );

    return [
      ...results.map((result) => ({
        amount: result.groupTransactionToUsersToGroups.amount,
        userId: result.usersToGroups.userId,
        transactionId: result.transactionsToGroups.transactionId,
        pending: result.groupTransactionState.pending,
        groupTransactionToUsersToGroupsId:
          result.groupTransactionToUsersToGroups.id,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}

export async function getGroupTransactionDetails(
  groupTransactionStateId: string
) {
  try {
    const results = await db
      .select({
        groupTransactionToUsersToGroups,
        users,
        transactions,
        groupTransactionToUsersToGroupsStatus,
      })
      .from(groupTransactionState)
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionToUsersToGroups.groupTransactionStateId,
          groupTransactionState.id
        )
      )
      .innerJoin(
        transactionsToGroups,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(
        transactions,
        eq(transactions.id, transactionsToGroups.transactionId)
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .innerJoin(users, eq(users.id, usersToGroups.userId))
      .innerJoin(
        groupTransactionToUsersToGroupsStatus,
        eq(
          groupTransactionToUsersToGroups.groupTransactionToUsersToGroupsStatusId,
          groupTransactionToUsersToGroupsStatus.id
        )
      )
      .where(eq(groupTransactionState.id, groupTransactionStateId));

    return results;
  } catch (e) {
    console.trace();
    console.error(e);
  }
}

export async function getGroupTransactionStateIdFromOwedId(owedId: string) {
  try {
    const results = await db
      .select()
      .from(groupTransactionToUsersToGroups)
      .innerJoin(
        groupTransactionState,
        eq(
          groupTransactionToUsersToGroups.groupTransactionStateId,
          groupTransactionState.id
        )
      )

      .innerJoin(
        groupTransactionToUsersToGroupsStatus,
        eq(
          groupTransactionToUsersToGroupsStatus.id,
          groupTransactionToUsersToGroups.groupTransactionToUsersToGroupsStatusId
        )
      )
      .where(eq(groupTransactionToUsersToGroups.id, owedId));
    return results[0];
  } catch (e) {
    console.trace();
    console.error(e);
  }
}

export async function updateOwedStatus(
  owedId: string,
  newStatus: OwedStatus[number],
  linkedTransactionId?: string,
  sender?: UserSchema
) {
  const states = await db.select().from(groupTransactionToUsersToGroupsStatus);

  const id = states.find((state) => state.status === newStatus)!.id;

  await db
    .update(groupTransactionToUsersToGroups)
    .set(
      linkedTransactionId
        ? { groupTransactionToUsersToGroupsStatusId: id, linkedTransactionId }
        : { groupTransactionToUsersToGroupsStatusId: id }
    )
    .where(eq(groupTransactionToUsersToGroups.id, owedId));

  const groupTransactionStateResult = await db
    .select()
    .from(groupTransactionToUsersToGroups)
    .innerJoin(
      groupTransactionState,
      eq(
        groupTransactionState.id,
        groupTransactionToUsersToGroups.groupTransactionStateId
      )
    )
    .where(eq(groupTransactionToUsersToGroups.id, owedId));

  const userIds = await db
    .select({
      userId: usersToGroups.userId,
      groupId: usersToGroups.groupId,
      amount: groupTransactionToUsersToGroups.amount,
      name: users.firstName,
    })
    .from(groupTransactionState)
    .innerJoin(
      groupTransactionToUsersToGroups,
      eq(
        groupTransactionState.id,
        groupTransactionToUsersToGroups.groupTransactionStateId
      )
    )
    .innerJoin(
      usersToGroups,
      eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
    )
    .innerJoin(users, eq(usersToGroups.userId, users.id))
    .where(
      eq(
        groupTransactionState.id,
        groupTransactionStateResult[0].groupTransactionState.id
      )
    );

  const group = (
    await db
      .select({ icon: groups.icon, color: groups.color })
      .from(groups)
      .where(eq(groups.id, userIds[0].groupId))
  )[0];

  userIds.forEach(async ({ userId, groupId, amount, name }) => {
    io.to(userId).emit("requestConfirmation", {
      owedId,
      groupId,
    });
    io.to(userId).emit("updateGroup", { groupId });

    if (amount > 0 && newStatus === "awaitingConfirmation") {
      await createGenericNotificationWithWebsocket(
        userId,
        "refreshNotifications",
        `${sender?.firstName} has sent you a transfer!`,
        group.icon,
        group.color,
        sender!.id
      );
    } else if (amount < 0 && newStatus === "confirmed") {
      await createGenericNotificationWithWebsocket(
        userId,
        "refreshNotifications",
        `${sender?.firstName} has confirmed your transfer.`,
        group.icon,
        group.color,
        sender!.id
      );
    }
  });
}

export async function getOwedStatusIdFromName(
  owedStatusName: OwedStatus[number]
) {
  const statusName = await db
    .select({ id: groupTransactionToUsersToGroupsStatus.id })
    .from(groupTransactionToUsersToGroupsStatus)
    .where(eq(groupTransactionToUsersToGroupsStatus.status, owedStatusName));
  return statusName[0].id as OwedStatus[number];
}

export async function getOwedStatusNameFromId(owedStatusId: string) {
  const statusName = await db
    .select({ status: groupTransactionToUsersToGroupsStatus.status })
    .from(groupTransactionToUsersToGroupsStatus)
    .where(eq(groupTransactionToUsersToGroupsStatus.id, owedStatusId));
  return statusName[0].status as OwedStatus[number];
}

export async function getAllGroupTransactionStatesFromGroupId(groupId: string) {
  return await db
    .select({ groupTransactionState })
    .from(groups)
    .innerJoin(
      transactionsToGroups,
      eq(groups.id, transactionsToGroups.groupsId)
    )
    .innerJoin(
      groupTransactionState,
      eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
    )
    .where(eq(groups.id, groupId));
}

export async function updateOwedAmount(owedId: string, amount: number) {
  await db
    .update(groupTransactionToUsersToGroups)
    .set({ amount })
    .where(eq(groupTransactionToUsersToGroups.id, owedId));
}

export async function getResultsPerGroupTransaction(groupId: string) {
  const groupTransactionStates =
    await getAllGroupTransactionStatesFromGroupId(groupId);
  return await Promise.all(
    groupTransactionStates.map(
      async (result) =>
        (await getGroupTransactionDetails(result.groupTransactionState.id))!
    )
  );
}

export async function getTransactionOwnerFromOwedId(owedId: string) {
  const results = await db
    .select({
      user: users,
    })
    .from(groupTransactionToUsersToGroups)
    .innerJoin(
      groupTransactionState,
      eq(
        groupTransactionToUsersToGroups.groupTransactionStateId,
        groupTransactionState.id
      )
    )
    .innerJoin(
      transactionsToGroups,
      eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
    )
    .innerJoin(
      transactions,
      eq(transactions.id, transactionsToGroups.transactionId)
    )
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    // cash acc path
    .leftJoin(cashAccount, eq(cashAccount.account_id, accounts.id))
    // plaid acc path
    .leftJoin(plaidAccount, eq(plaidAccount.accountsId, accounts.id))
    .innerJoin(items, eq(items.id, plaidAccount.itemId))
    // join users
    .innerJoin(
      users,
      or(eq(items.userId, users.id), eq(cashAccount.userId, users.id))
    )
    .where(eq(groupTransactionToUsersToGroups.id, owedId))
    .limit(1);

  console.log(results);
  return results[0].user;
}
