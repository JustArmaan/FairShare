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
            target: `#transactionList-${newTransactions.accountId}`,
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
            target: `#accountOverview-${newTransactions.accountId}`,
            swap: "outerHTML",
            event: "load",
          }
        );
      }
    });

    function refreshNotifications() {
      const notificationPage = document.querySelector("#ws-notification-page");
      if (!notificationPage) return;
      const sort = (
        document.querySelector("#notification-list") as HTMLDivElement
      ).dataset.selectedSort;

      htmx.ajax("GET", `/notification/notificationList?sort=${sort}`, {
        target: "#ws-notification-page",
        swap: "innerHTML",
      });
    }

    socket.on("groupInvite", ({ groupId }) => {
      const notificationIcon = document.querySelector("#notification-icon");
      refreshNotifications();

      if (notificationIcon) {
        htmx.ajax("GET", `/notification/notificationIcon`, {
          target: "#notification-icon",
          swap: "outerHTML",
        });
      }

      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({
            action: "triggerNotification",
            title: "Group Invite",
            message: `You have been invited to join group ${groupId}`,
          })
        );
      }
    });

    function refreshGroupList() {
      const groupPage = document.querySelector("#ws-group-list");
      if (!groupPage) return;
      htmx.ajax("GET", `/groups/page`, {
        target: "#app",
        swap: "innerHTML",
      });
    }

    function refreshGroupEditPage(groupId: string) {
      const groupEditPage = document.querySelector("#ws-group-edit");
      console.log("attempt to refresh", groupEditPage);
      if (!groupEditPage) return;
      htmx.ajax("GET", `/groups/edit/${groupId}`, {
        target: "#app",
        swap: "innerHTML",
      });
    }

    // group UI update events
    socket.on("joinedGroup", refreshGroupList);

    // refresh member list and owed/owing/history components in group view page
    socket.on("updateGroup", ({ groupId }) => {
      refreshGroupList();
      refreshGroupEditPage(groupId);

      const groupViewPage = document.querySelector("#ws-group-view");
      if (!groupViewPage || !(groupViewPage instanceof HTMLDivElement)) return;

      htmx.ajax("GET", `/groups/members/${groupId}`, {
        target: "#ws-group-members",
        swap: "outerHTML",
      });

      const owedOwingHistoryDiv = document.querySelector("#owed-owing-history");
      if (!(owedOwingHistoryDiv instanceof HTMLDivElement)) return;
      const selectedTab = owedOwingHistoryDiv.dataset.selectedTab;

      htmx.ajax(
        "GET",
        `/groups/view/OwedOwingHistory?groupId=${groupId}&tab=${selectedTab}`,
        {
          target: "#owed-owing-history",
          swap: "innerHTML",
        }
      );
    });

    socket.on("requestConfirmation", ({ owedId, groupId }) => {
      refreshGroupList();

      const splitViewDiv = document.querySelector("#split-details");
      if (!splitViewDiv || !(splitViewDiv instanceof HTMLDivElement)) return;

      htmx.ajax("GET", `/split/view?groupId=${groupId}&owedId=${owedId}`, {
        target: "#app",
        swap: "innerHTML",
      });
    });
  });
}

type NewTransaction = {
  transactionIds: string[];
  accountId: string;
};
