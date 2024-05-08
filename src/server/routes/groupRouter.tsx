import express from "express";
import { renderToHtml } from "jsxte";
import { env } from "../../../env";
import { getTransactionsForUser } from "../services/transaction.service";
import { Overview } from "../views/pages/Overview/Overview";
import { getUser } from "@kinde-oss/kinde-node-express";
import { createUser, findUser } from "../services/user.service";
import { seedFakeTransactions } from "../database/seedFakeTransations";
import { getBalance } from "../plaid/plaid";
import { ViewGroups } from "../views/pages/Groups/components/ViewGroup";
import Members from "../views/pages/Groups/components/Members";
import { OwedGroup } from "../views/pages/Groups/components/OwedGroup";
import BudgetChart from "../views/pages/Groups/components/BudgetChart";
const router = express.Router();

const memberDetails = [
  {
    name: "Joe",
    owe: "30.00",
    profile: "",
    purchase: "Restaurant Tab",
  },
  {
    name: "Bob",
    owe: "10.00",
    profile: "",
    purchase: "Gas Station Snacks",
  },
  {
    name: "Jonn",
    owe: "5.00",
    profile: "",
    purchase: "Noodle Cup",
  },
];

const groupBudget = [
  {
    budgetGoal: "4,000",
    spending: "1175",
  },
];

router.get("/view", getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
    }
    const userId = req.user.id; // TODO Use Promise.all
    const [currentUser, transactions] = await Promise.all([
      findUser(userId),
      getTransactionsForUser(req.user.id, 4),
    ]);

    const html = renderToHtml(
      <ViewGroups
        transactions={transactions}
        members={memberDetails}
        currentUser={currentUser}
        groupBudget={groupBudget}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post("/members", getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    // const query = req.body.search;
    // const transactions = await memebrsInGroup(userId, query);
    const currentUser = await findUser(userId);

    const html = renderToHtml(
      <div>
        <Members memberDetails={memberDetails} currentUser={currentUser} />
      </div>
    );

    res.send(html);
  } catch (error) {
    res.status(500).send("Error finding members");
  }
});
router.post("/owed", async (req, res) => {
  try {
    const userId = req.user!.id;
    // const query = req.body.search;
    // const transactions = await memebrsInGroup(userId, query);
    const currentUser = await findUser(userId);

    const html = renderToHtml(
      <OwedGroup memberDetails={memberDetails} currentUser={currentUser} />
    );

    res.send(html);
  } catch (error) {
    res.status(500).send("Error finding owings");
  }
});

router.post("/budgetchart", async (req, res) => {
  try {
    const userId = req.user!.id;
    // const query = req.body.search;
    // const transactions = await memebrsInGroup(userId, query);
    const currentUser = await findUser(userId);

    const html = renderToHtml(<BudgetChart groupBudget={groupBudget} />);

    res.send(html);
  } catch (error) {
    res.status(500).send("Error finding owings");
  }
});
export const groupRouter = router;
