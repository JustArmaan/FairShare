import express from "express";
import {
  findUser,
  type ExtractFunctionReturnType,
} from "../../services/user.service";
import {
  getGroupWithMembers,
  getTransactionsForGroup,
} from "../../services/group.service";
import { getAllOwedForGroupTransactionWithTransactionId } from "../../services/owed.service";
import {
  getAccountsForUser,
  getItemsForUser,
} from "../../services/plaid.service";
import { renderToHtml } from "jsxte";
import { ViewGroups } from "../../views/pages/Groups/components/ViewGroup";

const router = express.Router();

router.get("/:groupId", async (req, res) => {
  const userId = req.user!.id;
  const currentUser = await findUser(userId);

  if (!currentUser) throw new Error("No such user");

  const group = await getGroupWithMembers(req.params.groupId);

  if (!group) return res.status(404).send("No such group");

  const transactions = await getTransactionsForGroup(group.id);

  const owedPerMember = await Promise.all(
    transactions
      .map(async (transaction) => {
        return (await getAllOwedForGroupTransactionWithTransactionId(
          group.id,
          transaction.id
        )) as ExtractFunctionReturnType<
          typeof getAllOwedForGroupTransactionWithTransactionId
        >;
      })
      .filter((owed) => owed !== null)
  );

  const items = await getItemsForUser(req.user!.id);
  const defaultItem = items[0] && items[0].item;

  const groupBudget = [
    {
      budgetGoal: 4000,
      spending: 1175,
    },
  ];

  const account = await getAccountsForUser(userId, defaultItem.id);
  const accountId = account ? account[0].id : "";

  const html = renderToHtml(
    <ViewGroups
      groupId={group.id}
      transactions={transactions}
      members={group.members}
      currentUser={currentUser}
      groupBudget={groupBudget}
      owedPerMember={
        owedPerMember && owedPerMember.length > 0
          ? owedPerMember
          : [
              group.members.map((member) => ({
                transactionId: "",
                userId: member.id,
                amount: 0,
                groupTransactionToUsersToGroupsId: "",
                pending: true,
              })),
            ]
      }
      accountId={accountId} // refactor me!
      selectedDepositAccountId={null}
      itemId={defaultItem.id}
      url={`/groups/view/${group.id}`}
    />
  );
  res.send(html);
});

export const groupViewSubRouter = router;
