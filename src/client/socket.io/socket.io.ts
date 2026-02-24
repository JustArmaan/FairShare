import htmx from "htmx.org";
import { apiVersion } from "../main";

export function setupSocketListener() {
  const checkInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/v${apiVersion}/connected`);
      const { data } = await response.json();
      if (!data) return;

      clearInterval(checkInterval);
      connectSSE();
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  }, 1000);
}

function connectSSE() {
  const source = new EventSource("/api/sse");

  source.addEventListener("newTransaction", (e) => {
    const newTransactions: NewTransaction = JSON.parse(e.data).newTransactions;

    const transactionList = document.querySelector(
      `#transactionList-${newTransactions.accountId}`
    );
    const accountOverview = document.querySelector("#accountOverview");

    if (transactionList && newTransactions.transactionIds.length > 0) {
      newTransactions.transactionIds.forEach((id) => {
        htmx.ajax("GET", `/transactions/transaction/${id}`, {
          target: `#transactionList-${newTransactions.accountId}`,
          swap: "afterbegin",
        });
      });
    }

    if (accountOverview) {
      htmx.ajax(
        "GET",
        `/home/accountOverview/account/${newTransactions.accountId}`,
        {
          target: `#accountOverview-${newTransactions.accountId}`,
          swap: "outerHTML",
        }
      );
    }
  });

  source.addEventListener("groupInvite", (e) => {
    const { groupId } = JSON.parse(e.data);
    refreshNotifications();

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

  source.addEventListener("joinedGroup", () => {
    refreshGroupList();
  });

  source.addEventListener("refreshNotifications", () => {
    refreshNotifications();
  });

  source.addEventListener("updateGroup", (e) => {
    const { groupId } = JSON.parse(e.data);
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

  source.addEventListener("addOwed", () => {
    refreshNotifications();
  });

  source.addEventListener("requestConfirmation", (e) => {
    const { owedId, groupId } = JSON.parse(e.data);
    refreshGroupList();

    const splitViewDiv = document.querySelector("#split-details");
    if (!splitViewDiv || !(splitViewDiv instanceof HTMLDivElement)) return;

    htmx.ajax("GET", `/split/view?groupId=${groupId}&owedId=${owedId}`, {
      target: "#app",
      swap: "innerHTML",
    });
  });

  source.onerror = () => {
    console.log("SSE connection lost, browser will reconnect automatically");
  };
}

function refreshNotifications() {
  const notificationIcon = document.querySelector("#notification-icon");
  if (notificationIcon) {
    htmx.ajax("GET", `/notification/notificationIcon`, {
      target: "#notification-icon",
      swap: "outerHTML",
    });
  }

  const notificationPage = document.querySelector("#ws-notification-page");
  if (!notificationPage) return;

  const sort = (
    document.querySelector("#notification-list") as HTMLDivElement
  )?.dataset.selectedSort;

  htmx.ajax("GET", `/notification/notificationList?sort=${sort}`, {
    target: "#ws-notification-page",
    swap: "innerHTML",
  });
}

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
  if (!groupEditPage) return;
  htmx.ajax("GET", `/groups/edit/${groupId}`, {
    target: "#app",
    swap: "innerHTML",
  });
}

type NewTransaction = {
  transactionIds: string[];
  accountId: string;
};
