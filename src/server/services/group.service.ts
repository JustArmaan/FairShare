import { getDB } from "../database/client";
import { groups } from "../database/schema/group";
import { categories } from "../database/schema/category";
import { usersToGroups } from "../database/schema/usersToGroups";
import { memberType } from "../database/schema/memberType";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { users } from "../database/schema/users";
import type { UserSchemaWithMemberType } from "../interface/types";
import type { ExtractFunctionReturnType } from "./user.service";
import { transactionsToGroups } from "../database/schema/transactionsToGroups";
import { transactions } from "../database/schema/transaction";
import { groupTransactionState } from "../database/schema/groupTransactionState";
import { splitType } from "../database/schema/splitType";
import { accounts } from "../database/schema/accounts";
import { items } from "../database/schema/items";
import { groupTransactionToUsersToGroups } from "../database/schema/groupTransactionToUsersToGroups";
import { filterUniqueTransactions } from "../utils/filter";
import { create } from "domain";
import { createNotificationWithWebsocket } from "../utils/createNotification";
import { plaidAccount } from "../database/schema/plaidAccount";
import { splitEqualTransactions } from "../utils/equalSplit";

const db = getDB();

export async function getGroup(groupId: string) {
  try {
    const group = await db.select().from(groups).where(eq(groups.id, groupId));
    return group[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getGroupTransactionStateId(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select({ id: groupTransactionState })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .where(
        and(
          eq(transactionsToGroups.groupsId, groupId),
          eq(transactionsToGroups.transactionId, transactionId)
        )
      );
    return results[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTransactionsToGroup(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .where(
        and(
          eq(transactionsToGroups.groupsId, groupId),
          eq(transactionsToGroups.transactionId, transactionId)
        )
      );
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUsersToGroup(groupId: string, userId: string) {
  try {
    const results = await db
      .select()
      .from(usersToGroups)
      .where(
        and(
          eq(usersToGroups.groupId, groupId),
          eq(usersToGroups.userId, userId)
        )
      );
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateUsersToGroup(
  id: string,
  newUsersToGroups: Partial<ExtractFunctionReturnType<typeof getUsersToGroup>>
) {
  try {
    await db
      .update(usersToGroups)
      .set({ ...newUsersToGroups })
      .where(eq(usersToGroups.id, id));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getCategories = async () => {
  try {
    const allCategories = await db.select().from(categories).all();
    return allCategories;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCategory = async (categoryId: string) => {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));
    return category[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function getMemberType(type: string) {
  try {
    const result = await db
      .select()
      .from(memberType)
      .where(eq(memberType.type, type));
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type MemberTypeSchema = NonNullable<
  Awaited<ReturnType<typeof getMemberType>>
>;

export async function getGroupByOwedId(owedId: string) {
  try {
    const group = await db
      .select({ group: groups })
      .from(groupTransactionToUsersToGroups)
      .innerJoin(
        usersToGroups,
        eq(groupTransactionToUsersToGroups.usersToGroupsId, usersToGroups.id)
      )
      .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
      .where(eq(groupTransactionToUsersToGroups.id, owedId));
    return group[0].group;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getGroupWithMembers(groupId: string) {
  try {
    const result = await db
      .select({ group: groups, members: users, memberType })
      .from(groups)
      .innerJoin(usersToGroups, eq(usersToGroups.groupId, groupId))
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .innerJoin(memberType, eq(usersToGroups.memberTypeId, memberType.id))
      .where(eq(groups.id, groupId));

    return result.reduce((groups, currentResult) => {
      const groupIndex = groups.findIndex(
        (group) => group.id === currentResult.group.id
      );
      if (groupIndex === -1) {
        groups.push({
          ...currentResult.group,
          members: [
            { ...currentResult.members, type: currentResult.memberType.type },
          ],
        });
      } else {
        groups[groupIndex].members.push({
          ...currentResult.members,
          type: currentResult.memberType.type,
        });
      }
      return groups;
    }, [] as (GroupSchema & { members: UserSchemaWithMemberType[] })[])[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type GroupWithMembers = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembers>>
>;



export async function getGroupWithAcceptedMembers(groupId: string) {
  try {
    const memberTypeForMember = await getMemberType("Member");

    if (!memberTypeForMember) {
      throw new Error("Member type not found.");
    }

    const result = await db
      .select({ group: groups, members: users, memberType })
      .from(groups)
      .innerJoin(usersToGroups, eq(usersToGroups.groupId, groupId))
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .innerJoin(memberType, eq(usersToGroups.memberTypeId, memberType.id))
      .where(
        and(eq(groups.id, groupId), eq(memberType.id, memberTypeForMember.id))
      );

    return result.reduce((groups, currentResult) => {
      const groupIndex = groups.findIndex(
        (group) => group.id === currentResult.group.id
      );
      if (groupIndex === -1) {
        groups.push({
          ...currentResult.group,
          members: [
            { ...currentResult.members, type: currentResult.memberType.type },
          ],
        });
      } else {
        groups[groupIndex].members.push({
          ...currentResult.members,
          type: currentResult.memberType.type,
        });
      }
      return groups;
    }, [] as (GroupSchema & { members: UserSchemaWithMemberType[] })[])[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getGroupIdFromOwed(owedId: string) {
  try {
    const result = (
      await db
        .select()
        .from(groupTransactionToUsersToGroups)
        .innerJoin(
          usersToGroups,
          eq(groupTransactionToUsersToGroups.usersToGroupsId, usersToGroups.id)
        )
        .innerJoin(groups, eq(groups.id, usersToGroups.groupId))
        .where(eq(groupTransactionToUsersToGroups.id, owedId))
    )[0];

    return result.groups.id;
  } catch (e) {
    console.error(e);
    return;
  }
}

export async function setGroupTransactionStatePending(
  owedId: string,
  pending: true | null
) {
  try {
    const { groupTransactionState: groupTransactionStateResult } = (
      await db
        .select()
        .from(groupTransactionToUsersToGroups)
        .innerJoin(
          groupTransactionState,
          eq(
            groupTransactionToUsersToGroups.groupTransactionStateId,
            groupTransactionState.id
          )
        )
        .where(eq(groupTransactionToUsersToGroups.id, owedId))
    )[0];

    const updatedState = await db
      .update(groupTransactionState)
      .set({ pending })
      .where(eq(groupTransactionState.id, groupTransactionStateResult.id))
      .returning();

    return updatedState[0];
  } catch (e) {
    console.error(e);
    return;
  }
}

export async function getTransactionsForGroup(groupId: string) {
  try {
    const results = await db
      .select({
        id: transactions.id,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        company: transactions.company,
        amount: transactions.amount,
        timestamp: transactions.timestamp,
        address: transactions.address,
        latitude: transactions.latitude,
        longitude: transactions.longitude,
        pending: transactions.pending,
        type: splitType.type,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
        user: users,
      })
      .from(transactionsToGroups)
      .innerJoin(
        transactions,
        eq(transactions.id, transactionsToGroups.transactionId)
      )
      .innerJoin(categories, eq(categories.id, transactions.categoryId))
      .innerJoin(
        groupTransactionState,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(splitType, eq(splitType.id, groupTransactionState.splitTypeId))
      .innerJoin(accounts, eq(accounts.id, transactions.accountId))
      .innerJoin(plaidAccount, eq(plaidAccount.accountsId, accounts.id))
      .innerJoin(items, eq(items.id, plaidAccount.itemId))
      .innerJoin(users, eq(items.userId, users.id))
      .where(eq(transactionsToGroups.groupsId, groupId));

    return results.map((transaction) => ({
      ...transaction,
      category: {
        id: transaction.categoryId,
        name: transaction.name,
        color: transaction.color,
        icon: transaction.icon,
        displayName: transaction.name,
      },
      type: transaction.type,
    }));
  } catch (error) {
    console.error(error, "getTransactionsForGroup");
    return [];
  }
}

export type GroupWithTransactions = NonNullable<
  Awaited<ReturnType<typeof getTransactionsForGroup>>
>;

export const getGroupsAndAllMembersForUser = async (userId: string) => {
  try {
    const userGroups = await db
      .select({ groupId: usersToGroups.groupId })
      .from(usersToGroups)
      .where(eq(usersToGroups.userId, userId))
      .all();

    if (userGroups.length === 0) {
      console.log("No groups found for this user.");
      return [];
    }

    const groupIds = userGroups.map((group) => group.groupId);
    return (await Promise.all(groupIds.map(getGroupWithMembers))).filter(
      (result) => result !== null
    ) as ExtractFunctionReturnType<typeof getGroupWithMembers>[];
  } catch (error) {
    console.error("Error fetching groups and members for user:", error);
    return [];
  }
};

export type GroupSchema = NonNullable<Awaited<ReturnType<typeof getGroup>>>;

export async function getGroupWithMembersAndTransactions(groupId: string) {
  try {
    const groupWithMembers = await getGroupWithMembers(groupId);
    if (!groupWithMembers) {
      console.error("Group with members not found.");
      return null;
    }

    const transactions = await getTransactionsForGroup(groupId);

    return {
      ...groupWithMembers,
      transactions: transactions.map((transaction) => ({
        ...transaction,
        category: {
          ...transaction.category,
          categoryId: undefined,
          id: transaction.categoryId,
          name: transaction.category.name,
          color: transaction.category.color,
          icon: transaction.category.icon,
          displayName: transaction.category.name,
        },
      })),
    };
  } catch (error) {
    console.error(error, "Groups with Members and Transactions not found.");
    return null;
  }
}

export async function transactionSumForGroup(groupId: string) {
  try {
    const transactions = await getTransactionsForGroup(groupId);
    return transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  } catch (error) {
    console.error(error, "transactionSumForGroup");
    return 0;
  }
}

export type GroupMembersTransactions = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembersAndTransactions>>
>;

export async function getGroupTransactions(groupId: string) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .where(eq(transactionsToGroups.groupsId, groupId));
    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type GroupTransactions = NonNullable<
  Awaited<ReturnType<typeof getGroupTransactions>>
>;

export const createGroup = async (
  name: string,
  color: string,
  icon: string,
  temporary: string
) => {
  try {
    const group = await db
      .insert(groups)
      .values({
        id: uuidv4(),
        name,
        color,
        icon,
        temporary,
      })
      .returning();
    return group[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addMember = async (
  groupId: string,
  userId: string,
  type: string
) => {
  try {
    const invitedType = await db
      .select({ id: memberType.id })
      .from(memberType)
      .where(eq(memberType.type, type));

    if (invitedType.length === 0) {
      throw new Error("Member type 'Invited' not found.");
    }

    const memberTypeId = invitedType[0].id;

    const newMember = await db
      .insert(usersToGroups)
      .values({
        id: uuidv4(),
        groupId: groupId,
        userId: userId,
        memberTypeId: memberTypeId,
      })
      .returning();

    return newMember[0];
  } catch (error) {
    console.error("Failed to add member:", error);
    return false;
  }
};

export const updateGroup = async (
  groupId: string,
  name?: string,
  color?: string,
  icon?: string,
  temporary?: string
) => {
  try {
    const updateFields: {
      name?: string;
      color?: string;
      icon?: string;
      temporary?: string;
    } = {};

    if (name !== undefined) updateFields.name = name;
    if (color !== undefined) updateFields.color = color;
    if (icon !== undefined) updateFields.icon = icon;
    if (temporary !== undefined) updateFields.temporary = temporary;

    if (Object.keys(updateFields).length > 0) {
      const group = await db
        .update(groups)
        .set(updateFields)
        .where(eq(groups.id, groupId))
        .returning();
      return group[0];
    } else {
      console.log("No fields to update");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const checkUserInGroup = async (groupId: string, userId: string) => {
  try {
    const result = await db
      .select()
      .from(usersToGroups)
      .where(
        and(
          eq(usersToGroups.groupId, groupId),
          eq(usersToGroups.userId, userId)
        )
      );

    if (result.length > 0 && result[0].id) {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export type CategoriesSchema = NonNullable<
  Awaited<ReturnType<typeof getCategories>>
>;

export async function deleteMemberByGroup(userId: string, groupId: string) {
  try {
    await db
      .delete(usersToGroups)
      .where(
        and(
          eq(usersToGroups.groupId, groupId),
          eq(usersToGroups.userId, userId)
        )
      );
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addTransactionsToGroup(
  transactionId: string,
  groupId: string
) {
  try {
    return await db
      .insert(transactionsToGroups)
      .values({
        id: uuidv4(),
        groupsId: groupId,
        transactionId: transactionId,
      })
      .returning();
  } catch (error) {
    console.error(error, "Failed to add transaction");
    return false;
  }
}

export async function deleteTransactionFromGroup(
  transactionId: string,
  groupId: string
) {
  try {
    await db
      .delete(transactionsToGroups)
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );
    return true;
  } catch (error) {
    console.error(error, "Failed to delete transaction");
    return false;
  }
}

export async function getGroupTransactionWithSplitType(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select({
        transaction: transactions,
        user: users,
        type: splitType.type,
      })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(splitType, eq(groupTransactionState.splitTypeId, splitType.id))
      .innerJoin(transactions, eq(transactions.id, transactionId))
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
      .innerJoin(items, eq(plaidAccount.itemId, items.id))
      .innerJoin(users, eq(items.userId, users.id))
      .where(
        and(
          eq(transactionsToGroups.groupsId, groupId),
          eq(transactionsToGroups.transactionId, transactionId)
        )
      );
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type GroupTransactionWithSplitType = NonNullable<
  ExtractFunctionReturnType<typeof getGroupTransactionWithSplitType>
>;

export function getSplitOptions() {
  try {
    return db.select().from(splitType).all();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateSplitType(
  transactionStateId: string,
  splitTypeId: string
) {
  try {
    return await db
      .update(groupTransactionState)
      .set({ splitTypeId })
      .where(eq(groupTransactionState.id, transactionStateId))
      .returning();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserGroupId(userId: string, groupId: string) {
  try {
    const results = await db
      .select()
      .from(usersToGroups)
      .where(
        and(
          eq(usersToGroups.userId, userId),
          eq(usersToGroups.groupId, groupId)
        )
      );
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateGroupTransactionToUserToGroup(
  groupId: string,
  transactionId: string,
  userId: string,
  amount: number
) {
  try {
    const userGroup = await getUserGroupId(userId, groupId);
    const transactionStateId = await getGroupTransactionStateId(
      groupId,
      transactionId
    );

    if (!userGroup || !transactionStateId) {
      return null;
    }

    await db
      .update(groupTransactionToUsersToGroups)
      .set({ amount })
      .where(
        and(
          eq(
            groupTransactionToUsersToGroups.groupTransactionStateId,
            transactionStateId.id
          ),
          eq(groupTransactionToUsersToGroups.usersToGroupsId, userGroup.id)
        )
      );
  } catch (error) {
    console.error(error);
  }
}

export async function getGroupTransactionToUserToGroupById(
  groupTransactionId: string
) {
  try {
    const result = await db
      .select()
      .from(groupTransactionToUsersToGroups)
      .where(eq(groupTransactionToUsersToGroups.id, groupTransactionId));
    if (result.length === 0) {
      throw new Error("No group transaction found");
    }
    return result;
  } catch (error) {
    console.log(error, "Failed to get transaction from group id");
    return null;
  }
}

export async function getGroupWithEqualSplitTypeTransactionsAndMembers(
  groupId: string
) {
  try {
    const results = await db
      .select({
        transactionState: groupTransactionState,
        transactionAmount: groupTransactionToUsersToGroups.amount,
        transaction: transactions,
        transactionOwner: users,
      })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        transactions,
        eq(transactionsToGroups.transactionId, transactions.id)
      )
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
      .innerJoin(items, eq(plaidAccount.itemId, items.id))
      .innerJoin(users, eq(items.userId, users.id))
      .innerJoin(splitType, eq(groupTransactionState.splitTypeId, splitType.id))
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .where(
        and(
          eq(transactionsToGroups.groupsId, groupId),
          eq(splitType.type, "equal")
        )
      );

    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type GroupWithEqualSplitTypeTransactionsAndMembers = NonNullable<
  ExtractFunctionReturnType<
    typeof getGroupWithEqualSplitTypeTransactionsAndMembers
  >
>;

export async function updateOwedForGroupTransaction(
  groupId: string,
  userId: string,
  transactionId: string,
  amount: number
) {
  try {
    const userGroup = await getUserGroupId(userId, groupId);
    const transactionStateId = await getGroupTransactionStateId(
      groupId,
      transactionId
    );

    if (!userGroup || !transactionStateId) {
      return null;
    }

    const result = await db
      .update(groupTransactionToUsersToGroups)
      .set({ amount })
      .where(
        and(
          eq(
            groupTransactionToUsersToGroups.groupTransactionStateId,
            transactionStateId.id
          ),
          eq(groupTransactionToUsersToGroups.usersToGroupsId, userGroup.id)
        )
      )
      .returning();
    if (result.length === 0) {
      return await db
        .insert(groupTransactionToUsersToGroups)
        .values({
          id: uuidv4(),
          groupTransactionStateId: transactionStateId.id,
          usersToGroupsId: userGroup.id,
          amount,
        })
        .returning();
    } else {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getUserTotalOwedForGroup(
  userId: string,
  groupId: string
) {
  try {
    const userGroup = await getUserGroupId(userId, groupId);
    if (!userGroup) {
      return null;
    }

    const results = await db
      .select()
      .from(groupTransactionToUsersToGroups)
      .where(eq(groupTransactionToUsersToGroups.usersToGroupsId, userGroup.id));

    return results.reduce((sum, result) => sum + result.amount, 0);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function changeMemberTypeInGroup(
  userId: string,
  groupId: string,
  type: string
) {
  try {
    const memberType = await getMemberType(type);

    if (!memberType) {
      return null;
    }

    const userGroup = await getUserGroupId(userId, groupId);

    if (!userGroup) {
      return null;
    }

    const newMember = await db
      .update(usersToGroups)
      .set({ memberTypeId: memberType.id })
      .where(eq(usersToGroups.id, userGroup.id))
      .returning();

    if (newMember) {
      const equalSplitGroupTransactionsWithAllOwed =
        await getGroupWithEqualSplitTypeTransactionsAndMembers(groupId);

      const groupWithMembers = await getGroupWithAcceptedMembers(groupId);
      if (equalSplitGroupTransactionsWithAllOwed && groupWithMembers) {
        const equalSplitGroupTransactions = filterUniqueTransactions(
          equalSplitGroupTransactionsWithAllOwed
        );

        await splitEqualTransactions(
          equalSplitGroupTransactions,
          groupId,
          groupWithMembers
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getGroupOwner(groupId: string) {
  try {
    const owner = await getMemberType("Owner");

    if (!owner) {
      throw new Error("Owner type not found.");
    }

    const group = await db
      .select()
      .from(usersToGroups)
      .where(
        and(
          eq(usersToGroups.groupId, groupId),
          eq(usersToGroups.memberTypeId, owner.id)
        )
      );

    return group[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
