import express from "express";
import { renderToHtml } from "jsxte";
import { TransactionsPage } from "../views/pages/transactions/Transactions";
import { env } from "../../../env";
import {
  debug_getTransactionsForAnyUser,
  getTransaction,
  getTransactionsForUser,
} from "../services/transaction.service";
import { text } from "stream/consumers";
import type { tr } from "@faker-js/faker";
import { Overview } from "../views/pages/Overview/Overview";
import { Header } from "../views/components/Header";
import { Nav } from "../views/components/Navigation";
import { Default } from "../views/components/Default";
import { Menu } from "../views/components/Menu";
import { TransactionDetailsPage } from "../views/pages/transactions/TransactionDetails";
import { getUser } from "@kinde-oss/kinde-node-express";
import { createUser, findUser } from "../services/user.service";
import { seedFakeTransactions } from "../database/seed";
const router = express.Router();

const cardHtml = {
  bankLogo: "/cardAssets/scotiabank.svg",
  bankName: "ScotiaBank",
  cardNumber: "8763 **** **** ****",
  cardHolder: "John Doe",
  expiryDate: "10/28",
  primaryColor: "card-red",
  textColor: "font-off-white",
  accentColor1: "accent-yellow",
  accentColor2: "accent-red",
};

router.get("/home", getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
    }

    const { id, given_name, family_name, email, picture } = req.user;
    console.log(req.user, "bye");
    const databaseUser = await findUser(id);
    console.log(databaseUser);
    if (!databaseUser) {
      await createUser(id, given_name, family_name, email, picture);
      await seedFakeTransactions(id, 20);
    }
    console.log(req.user, "hi");
    const transactions = await getTransactionsForUser(req.user.id, 4);

    const userDetails = {
      userName: "John Doe",
      totalAmount: "8,987.34",
      cardsAmount: ["3,411.12", "5,223.52"],
    };

    const html = renderToHtml(
      <Overview transactions={transactions} userDetails={userDetails} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/transactionDetails/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await getTransaction(transactionId);

    if (!transaction) return res.status(404).send("404");

    const html = renderToHtml(
      <TransactionDetailsPage transaction={transaction} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/menu", async (_, res) => {
  try {
    const html = renderToHtml(<Menu />);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await getTransactionsForUser(req.user!.id, 4); // Could this be undefined

    const html = renderToHtml(
      <TransactionsPage transactions={transactions} cardDetails={cardHtml} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/header", (req, res) => {
  try {
    const html = renderToHtml(<Header />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/nav", (req, res) => {
  try {
    const html = renderToHtml(<Nav />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export const indexRouter = router;
