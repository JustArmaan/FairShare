import { io } from "socket.io-client";
import htmx from "htmx.org";

export function setupSocketListener() {
  document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    socket.on("newTransaction", (data) => {
      const newTransactions: NewTransaction = data.newTransactions;
      const transactionList = document.querySelector(
        `#transactionList-${newTransactions.accountId}`
      );
      const accountOverview = document.querySelector("#accountOverview");

      if (
        transactionList &&
        newTransactions &&
        newTransactions.transactionIds.length > 0
      ) {
        newTransactions.transactionIds.map((id) => {
          htmx.ajax("GET", `/transactions/transaction/${id}`, {
            target: "#transactionList-${newTransactions.accountId}",
            swap: "afterbegin",
            event: "load",
          });
        });
      }

      if (accountOverview && newTransactions) {
        htmx.ajax(
          "GET",
          `/home/accountOverview/account/${newTransactions.accountId}`,
          {
            target: `accountOverview-${newTransactions.accountId}`,
            swap: "outerHTML",
            event: "load",
          }
        );
      }
    });

    socket.on("groupInvite", (data) => {
      const groupId: string = data.groupId;
      const notificationIcon = document.querySelector("#notification-icon");
      const notificationList = document.querySelector("#notificationList");

      if (notificationIcon) {
        htmx.ajax("GET", `/notification/notificationIcon`, {
          target: "#notification-icon",
          swap: "outerHTML",
          event: "load",
        });
      }

      if (notificationList) {
        htmx.ajax("GET", `/notification/notificationList/${groupId}`, {
          target: "#notification-list",
          swap: "outerHTML",
          event: "load",
        });
      }
    });
  });
}

type NewTransaction = {
  transactionIds: string[];
  accountId: string;
};
